var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var request = require('supertest');
var server = require('../app.js');
chai.use(chaiHttp);
var otpCode,otpKey;

/**
 * Test Suites
 */
describe('OTP Test Cases', function () {
    // Start the server before the test case with delay of 1second to instantiate the routers
    before(function (done) {
        this.request = chai.request(server);
        setTimeout(function () {
            done();
        }, 1000);
    });
    describe('Method POST', function () {
        it('should be able to Generate OTP', function (done) {
            this.request.post("/generate")
                .send({})
                .set('Accept', 'application/json')
                .end(function (err, res) {
		    res.should.have.status(200);
                    res.should.have.property('text');
		    var resBody = JSON.parse(res.text);
		    otpCode = resBody.otpCode;
		    otpKey = resBody.otpKey;
                    done();
                });


        });
    });


    describe('Method POST', function () {
        it('should be able to validate OTP', function (done) {
            this.request.post('/validate')
                .send({"otpCode": otpCode, "otpKey": otpKey})
                .end(function (err, res) {
		    res.should.have.status(200);
                    res.should.have.property('text');
                    done();
                });
        });
    });
});


