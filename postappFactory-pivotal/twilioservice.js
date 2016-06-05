/**
 * Created by 423919 on 5/23/2016.
 * This module is used to send sms
 */


var TwilioService = function () {

};

// this api will configure the twilio obj and send the sms
TwilioService.prototype.sendMessage = function (twilioObj, callback) {
        var client = require('twilio')(twilioObj.accountSID, twilioObj.authToken);
        var message = {
            to: twilioObj.to,
            from: twilioObj.from,
            body: twilioObj.body
        };
        var respData = {};

        client.sendSms(message, function (error, message) {
            if (!error) {
                respData.status = 'Success! The SID for this SMS message is:' + message.sid;
                respData.sentDate = message.dateCreated;
                return callback(null,respData);

            } else {
                respData.status = 'Oops! There was an error.' + JSON.stringify(error);
               return callback(respData);
            }
        });

};

module.exports = TwilioService;