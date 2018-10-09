const mongoose = require('mongoose');

var Account = mongoose.Schema({
    _id:String,
    accountname: String,
    email: String,
    password: String    
});
 
var account = mongoose.model('accont', Account);
 
module.exports = account;