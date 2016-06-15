/**
 * Created by 423919 on 5/26/2016.
 * Sample app created to demonstrate how the OTP can be hooked to any micro 
 * services
 */
var express = require('express');
var app = express();
// here we are hooking the otp with this app
var otp = require('./otp.js');
var otpObj = new otp();
// created route for generateOtp
otpObj.generateOtp(app);
// created route for validateOtp
otpObj.validateOtp(app);

var port = process.env.VCAP_APP_PORT || 3000;
//started a server which is listening on port 
app.listen(port);
console.log('Otp Server is listening on port ' + port);

module.exports = app;
