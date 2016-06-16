// dependencies
var fs = require('fs');
var express = require('express');
var path = require('path');
var config = require('./config.json');
var app = express();

// configure Express
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

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
    res.render('index', { title: "OAuth Authentication", config: config});
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



// port
var port = process.env.PORT || 3001;
app.listen(port);

module.exports = app;

