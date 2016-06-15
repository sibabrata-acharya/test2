/**
 * Created by 423919 on 5/18/2016.
 * This is the Otp module which generate a token and validate the same
 */
// dependencies for this module
var crypto = require('crypto');
var cipherPwd = 'oyeilyodd';
var encryptionType = 'aes192';
var randomString = require("randomstring");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var config = require('./config.json');
//constructor
var Otp = function () {

};


// This api is use to generate an OTP based on the length,type and expiry
// time

Otp.prototype.generateOtp = function (app) {
    // route for generate Otp
    app.post("/generate", jsonParser, function (req, res) {

        var otpOptions = {};
        //creating the otpOptions from the config.json
        otpOptions.length = (config.otp && config.otp.otpLength) ? config.otp.otpLength : 4;
        otpOptions.charset = (config.otp && config.otp.otpType) ? config.otp.otpType : 'numeric';
        var expiryTime = (config.otp && config.otp.otpExpiryTime) ? config.otp.otpExpiryTime : 10;
        var otpCode = randomString.generate(otpOptions);
       
        //otpGenTime will have current time in milliseconds
        var otpGenTime = Date.now();
        //generating the expiry time in milliseconds
        var otpExpiryTime = otpGenTime + (expiryTime * 60000);
        //generating the secret data for the key which is a combination
        // of otpcode and expiry time in the format ("otpCode-otpExpiryTime")
        var secretData = otpCode + '-' + otpExpiryTime;

        // encrypting the secretData with the cipherPwd
        var cipher = crypto.createCipher(encryptionType, cipherPwd);
        var encrypted = cipher.update(secretData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // checking the channel in config.json 
        if (config.channel === 'twilio') {
            //hooking the twilio to OTP
            var twilio = require("./twilioservice.js");
            var twilioObj = new twilio();
            //creating the options for twilio
            var msgObj = {
                "accountSID": config.twilio.accountSID,
                "authToken": config.twilio.authToken,
                "to": config.twilio.toRecipient,
                "from": config.twilio.from,
                "body": "OTP pin is " + otpCode

            };
            
            twilioObj.sendMessage(msgObj, function (err, result) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                if (err) {

                    res.send(JSON.stringify(err), 400);
                }
                else {
                    var resObj = {
                        otpCode: otpCode,
                        otpKey: encrypted
                    };

                    res.send(JSON.stringify(resObj), 200);
                    
                }

            });
        } else if (config.channel === 'sendgrid') {
            //hooking the sendgrid to OTP
            var sendmail = require("./sendgridservice.js");
            var sendmailObj = new sendmail();
            //creating the options for sendgrid
            var msgObj = {
                "accountSID": config.sendgrid.accountSID,
                "authToken": config.sendgrid.authToken,
                "toRecipient": config.sendgrid.toRecipient,
                "fromMail": config.sendgrid.from,
                "subject": "Please find the otp",
                "text": "OTP pin is " + otpCode
            };
            sendmailObj.sendMail(msgObj, function (err, result) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                if (err) {
                    res.send(JSON.stringify(err), 400);
                }
                else {
                    var resObj = {
                        otpCode: otpCode,
                        otpKey: encrypted
                    };
                    res.send(JSON.stringify(resObj), 200);
                }
            });
        }
    });
};

// This api is used to validate the otp given by the user,
// with the key
Otp.prototype.validateOtp = function (app) {

    app.post("/validate", jsonParser, function (req, res) {

        //creating the Decipher with the cipherPwd
        var decipher = crypto.createDecipher(encryptionType, cipherPwd);
        // gets the otp key 
        var encrypted = req.body.otpKey;
        // decrypting the key to get the OTP and expiry time which comes in "OTP-EXPIRYTIME" format
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        // spliting the "OTP-EXPIRYTIME" format decrrypt data to get otp and expiry time
        var splitedSecretData = decrypted.split('-');
        var status = {};
        var currentTime = Date.now();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if (req.body.otpCode === splitedSecretData[0] && splitedSecretData[1] > currentTime) {
            status.status = "OTP is validated successfully";
            res.send(JSON.stringify(status), 200);
        } else {
            status.status = "OTP validation failed ";
            res.send(JSON.stringify(status), 400);
        }
       
       


    });
};

module.exports = Otp;
