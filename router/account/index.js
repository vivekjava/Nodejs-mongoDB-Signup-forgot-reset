"use strict"; 
var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const uuid = require('uuid');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const common = require('./common');
const url = 'mongodb://'+config.db_namespace+':'+config.port+'/' ;
const database = 'authentication';
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ',req.url)
  next()
})
// define the home page route
router.post('/authenticate', (req, res,next) => {
    let request = req.body ;
    let response = {};
    if(!request.email || !request.password){
        response.code = 401 ;
        response.message = 'Invalid arguement.';
        res.statusCode = 401 ;
        res.send(response);
    }
    var query = {};
    query.email = request.email ;
    query.password = md5(request.password) ;
    mongodb.connect(url,{ useNewUrlParser: true },(err, db) => {
        if (err) throw err;
        var dbo = db.db(database);
		console.log('Successfully connected'+JSON.stringify(query));
		dbo.collection('accounts').find(query,{email:1,password:0}).toArray((err, dbres) => {           
            if (err) throw err;

            if(dbres && (dbres.length != 1) ){
                response.code = 401;
                response.message = 'un-authorized';
                res.statusCode = 401;
                res.send(response);
            }else{
                let accountdetail = dbres[0] ;
                var token = jwt.sign({ id: accountdetail._id,timestamp:new Date() }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                response.code = 200 ;
                response.message = 'successfully logged in.';
                response.token = token;
                res.statusCode = 200;
                res.send(response);
            }
        });
    });    
})


router.post('/create', (req, res) => {
    let request = req.body ;
    let body = {};
    let response = {};
	if(request.email){
		body.email = request.email ;
    }
	if(request.accountname){
		body.accountname = request.accountname ;
	}
	if(request.password){
		body.password = md5(request.password);
    }
    body._id = uuid.v4();
    mongodb.connect(url,{ useNewUrlParser: true },function(err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        console.log('Successfully connected');
        var query = {};
        query.email = request.email ;
        dbo.collection('accounts').find(query).toArray((err, dbres) => {
            
            if (err) throw err;
           
            if(dbres && dbres.length > 0){
                response.code = 400 ;
                response.message =  'Account Already Exists.';
                res.statusCode = 400 ;
                res.send(response);
            }
            dbo.collection('accounts').insertOne(body, function(err, dbres) {
                if (err) throw err;
                db.close();
            
                console.log('Account successfully saved.');
                response.code = 200 ;
                response.message = 'Record inserted successfully.';
                return res.send(response);
            });

        });
	});
})



router.post('/forgot', (req, res) => {

    let request = req.body ;
    let response = {};
    if(!request.email){
        response.code = 400 ;
        response.message = 'email required..!';
        res.statusCode = 400 ;
        res.send(response);
    }
    var query = {};
    query.email = request.email ;
    mongodb.connect(url,{ useNewUrlParser: true },(err, db) => {
        if (err) throw err;
        var dbo = db.db(database);
		console.log('Successfully connected');
		dbo.collection('accounts').find(query).toArray((err, dbres) => {
            
            if (err) throw err;
           
            if(dbres && (dbres.length > 1 || dbres.length ==0)){
                response.code = 400 ;
                response.message = (dbres.length ==0) ? 'account not found in the system': 'more then one account identified.';
                res.statusCode = 400 ;
                res.send(response);
            }
            let accountdetail = dbres[0];
           // console.log(accountdetail);
            let requestCollection = {};
            requestCollection.email = request.email ;
            requestCollection.code = Math.floor(1000 + Math.random() * 9000); ;
            requestCollection.create = new Date() ;
            requestCollection.status = 'pending' ;

            dbo.collection('request').insertOne(requestCollection, function(err, dbres) {
                if (err) throw err;

                db.close();
                let notification = {};
                notification.email = accountdetail.email ;
                notification.subject = 'click the below link to reset the password.';
                notification.body = 'Please click this url http://UI.com and use this code to reset your password : '+requestCollection.code;
                common.sendMail(notification) ;             
                response.code = 200 ;
                response.message = 'Please check your mail to reset your password.';
                return res.send(response);
            });
		});
	});
})


/* 
    1. create auth token 
    2. append with email
*/
router.post('/reset', (req, res) => {
    let request = req.body ;
    let response = {};
    if(!request.email){
        response.code = 400 ;
        response.message = 'email required..!';
        res.statusCode = 400 ;
        res.send(response);
    }
    var query = {};
    query.email = request.email ;
    query.code = parseInt(request.code);
    query.status = 'pending';
    mongodb.connect(url,{ useNewUrlParser: true },(err, db) => {
        if (err) throw err;
        var dbo = db.db(database);
		console.log('Successfully connected'+JSON.stringify(query));
		dbo.collection('request').find(query).toArray((err, dbres) => {
            
            if (err) throw err;
           
            if(dbres && dbres.length ==0){
                response.code = 400 ;
                response.message ='invalid code please try again.';
                res.statusCode = 400 ;
                res.send(response);
            }

            let set = {};
            set.$set = {};
            set.$set.status = 'completed' ;
            dbo.collection('request').updateOne(query,set,(err, dbres) => {
                var accountQuery = {};
                accountQuery.email = request.email ;
                var accountset = {};
                accountset.$set = {};
                accountset.$set.password = md5(request.password) ;
                dbo.collection('accounts').updateOne(accountQuery,accountset,(err, dbres) => {
                    if (err) throw err;
                    db.close();
                    response.code = 200 ;
                    response.message ='Password reset successfully.';
                    res.statusCode = 200 ;
                    res.send(response);
                });
            });

        });
    });
  
    
})

module.exports = router ;