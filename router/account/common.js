const promise = require('promise');
const nodemailer = require('nodemailer');
const config = require('../config');
var transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.username,
      pass:config.password
    }
  });
function sendMail(request){
    //return new Promise(function(resolve, reject) {
        var mailOptions = {
            from: config.username,
            to: request.email,
            subject: request.subject,
            text: request.body
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              //reject({'error':error,'info':info});
            } else {
              console.log('Email sent: ' + info.response);
              //resolve({'result':true});
            }
          });

   // });
}

exports.sendMail = sendMail ;