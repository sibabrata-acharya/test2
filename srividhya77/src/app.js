// dependencies
var fs = require('fs');
var express = require('express');
var path = require('path');
var config = require('./config.json');
var hookConfig = require('./hook.json');
var app = express();
var request = require('request');

// configure Express
app.configure(function() {
    app.set('views', __dirname + './../views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + './../public'));

});

//Reading VCAP_APPLICATION information for current application URL
var services_env = JSON.parse(process.env.VCAP_APPLICATION || "{}");
var callbackUrl = "http://"+services_env.uris[0]+"/callback";

// routes
app.get('/', function(req, res){
    res.redirect('/login');
});

// GET /login
//  Login page to show the provider options to login
app.get('/login', function(req, res){
    res.render('index', { title: "OAuth Authentication", config: config, serviceUrl:"http://localhost:3001"});
});

// GET /OAuth
//  This API is called from index.jade with the query parameter as provider.
//  Later it will call the authentication service with query parameter as callbackUrl
app.get('/OAuth', function(req, res){
    //Reading VCAP information for AuthService base URL
    var services_vcap = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var serviceUrl = services_vcap.AuthService[0].credentials.serviceUrl+"/";

    var provider = req.query.provider;

    //Calling /facebook|/twitter|/google|/linkedin service of AuthService
    var baseUrl = serviceUrl+provider+"?callbackUrl="+callbackUrl;
    res.redirect(baseUrl);
});

// GET /callback
//  After successful authentication with provider authentication service will redirect
//  back to the callback which is passed during the /OAuth call
app.get('/callback', function(req, res){
    //Check if query params are present and access the information. Else redirect to login page
    if(req.query.accessToken){
        console.log("accesstoken : "+ req.query.accessToken);
        console.log("id : "+ req.query.id);
        console.log("displayName : "+ req.query.displayName);
        console.log("provider : "+ req.query.provider);

        //refreshToken will be available only for twitter call
        if(req.query.refreshToken) {
            console.log("refreshToken : "+ req.query.refreshToken);
        }

        var profile = {
            id : req.query.id,
            displayName : req.query.displayName
        }

        res.render('account', { user: profile });
    }
    else {
        res.render('index', { title: "OAuth Authentication", config: config});
    }

});

// GET /logout
//  Terminates an existing login session and redirects to the callbackUrl
app.get('/logout', function(req, res){
    //Reading VCAP information for AuthService base URL
    var services_vcap = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var serviceUrl = services_vcap.AuthService[0].credentials.serviceUrl;

    //Calling /logout service of AuthService
    res.redirect(serviceUrl+"/logout?callbackUrl="+callbackUrl);
});

// POST /generateOTPWithTwilio
//  Refer hook.json and update the values for twilio key.
//  This API will hit the /generate method of authentication service with the required twilio JSON body.
//  For UI sample this method is called from index_With_PreHook.jade file. Render to this jade file instead of index.jade to check
app.post("/generateOTPWithTwilio", function(req, res){
    var services_vcap = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var serviceUrl = services_vcap.AuthService[0].credentials.serviceUrl+"/generate";
    request({
        url: serviceUrl, //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: hookConfig.twilio
    }, function(error, response, body){
        if(error) {
            console.log(error);
            res.send(response.statusCode, JSON.stringify(error));

        } else {
            console.log(response.statusCode, body);
            res.send(response.statusCode, body);
        }
    });
});

// POST /generateOTPWithSendGrid
//  Refer hook.json and update the values for sendgrid key.
//  This API will hit the /generate method of authentication service with the required sendgrid JSON body.
//  For UI sample this method is called from account_With_PostHook.jade file. Render to this jade file instead of account.jade to check
app.post("/generateOTPWithSendGrid", function(req, res){
    var services_vcap = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var serviceUrl = services_vcap.AuthService[0].credentials.serviceUrl+"/generate";
    request({
        url: serviceUrl, //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: hookConfig.sendgrid
    }, function(error, response, body){
        if(error) {
            console.log(error);
            res.send(response.statusCode, JSON.stringify(error));

        } else {
            console.log(response.statusCode, body);
            res.send(response.statusCode, body);
        }
    });
});

// POST /validateOTP
//  This API will hit the /validate method of authentication service with the required JSON body created from /generate method.
//  For UI sample this method is called from index_With_PreHook.jade and account_With_PostHook.jade files.
app.post("/validateOTP", function(req, res){
    var services_vcap = JSON.parse(process.env.VCAP_SERVICES || "{}");
    var serviceUrl = services_vcap.AuthService[0].credentials.serviceUrl+"/validate";
    request({
        url: serviceUrl, //URL to hit
        method: 'POST',
        //Lets post the following key/values as form
        json: req.body
    }, function(error, response, body){
        if(error) {
            console.log(error);
            res.send(response.statusCode, JSON.stringify(error));

        } else {
            console.log(response.statusCode, body);
            res.send(response.statusCode, body);
        }
    });
});


// port
var port = process.env.PORT || 3001;
app.listen(port);

module.exports = app;

