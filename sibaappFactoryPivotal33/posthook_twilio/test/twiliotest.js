var index = require('../twilioservice.js');
var expect = require('chai').expect;

describe("check whether sendgridservice is present or not", function () {
    it("should exist", function () {
        expect(index).to.not.be.undefined;
    });
});

describe("check Email Functionality", function () {
    var twilioservice = new index();
    var options = {
        "accountSID": "AC728b20a72ea48a175a0cf47d11a6aa56",
        "authToken": "1c84da28903505f762c727fe1bd65700",
        "to": "+919539168770",
        "from": "+17758354685",
        "body": "mocha test for twilio"
    };
    it("should exist", function (done) {

        twilioservice.sendMessage(options, function (err, result) {
            expect(err).to.be.a('null');
            done();


        });
    });

});
