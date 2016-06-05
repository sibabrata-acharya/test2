/**
 * Created by 423919 on 5/26/2016.
 */
/**
 * Created by 423919 on 5/23/2016.
 * This module is used to send sms
 */

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var config = require('./config.json')
var Twilio = function () {

};

// this api will configure the twilio obj and send the sms
Twilio.prototype.sendSMS = function (app) {

    app.post('/sendsms',jsonParser, function (req, res) {

        var message = {
            accountSID:config.twilio.accountSID,
            authToken:config.twilio.authToken,
            to: config.twilio.toRecipient,
            from: config.twilio.fromNo,
            body: req.body.messageContent
        };
        var TwilioService = require('./twilioservice.js');
        var twilioObj = new TwilioService();

        twilioObj.sendMessage(message, function (err, result) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            if (err) {
                res.send(JSON.stringify(err), 400);
            }
            else {
                res.send(JSON.stringify(result), 200);
            }
        });
    });


};

module.exports = Twilio;