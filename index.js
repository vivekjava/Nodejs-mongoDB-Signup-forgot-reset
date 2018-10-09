"use strict"; 
var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');
var path = require('path');
var app = express();
var port = 3000;
// initial level of scaling
const os = require('os');
const cpu = os.cpus().length ;
const cluster = require('cluster');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if(cluster.isMaster){

    console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < cpu; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
    
}else{
    const account = require('./router/account/index');
    app.all('/',function(req,res,next){        
        //Auth Each API Request created by user.
        next();    
    });

    /*  
        To handle CORS ERROR
    */
    app.use(function(req, res, next) { 
        res.header("Access-Control-Allow-Origin", "*"); 
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
        next(); 
    });
    app.use('/authentication/account',account);
    app.use(function (err, req, res, next) {
        //console.error(err.stack)
        res.status(500).send(err);
    })
    
    process.on('uncaughtException',function(err){
        console.log("Uncaught Exception");
    });
    var server = app.listen(port,function() {    
        console.log("Server Started in port : "+port);
    });
    
}
