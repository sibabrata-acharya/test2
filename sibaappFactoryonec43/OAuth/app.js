// dependencies
var fs = require('fs');
var express = require('express');
var passport = require('passport');
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
    app.use(express.session({ secret: 'my_precious' }));

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

});


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Provider(facebook/google/twitter/linkedin)
// profile is serialized and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


// routes
app.get('/', function(req, res){
    res.redirect('/login');
});

//Login page to show the provider options to login
app.get('/login', function(req, res){
    res.render('index', { title: "OAuth Authentication", config: config});
});

//Show some profile information after login to any provider
app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

//Terminate an existing login session and redirect to login page.
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

// port
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);

module.exports = app;

//Initiate provider configuration and routes.
