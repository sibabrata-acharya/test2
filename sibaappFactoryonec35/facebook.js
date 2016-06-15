// dependencies
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var config = require('./config.json');

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `done`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return done(null, profile);
    }
));

function facebook(app){
    // GET /auth/facebook
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Facebook authentication will involve
    //   redirecting the user to facebook.com.  After authorization, Facebook will
    //   redirect the user back to this application at /auth/facebook/callback
    app.get('/auth/facebook',
        //for facebook scope information refer https://developers.facebook.com/docs/facebook-login/permissions
        passport.authenticate('facebook',{ authType: 'rerequest', scope: ['user_friends', 'manage_pages'] }),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so this
            // function will not be called.
        }
    );

    // GET /auth/facebook/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the account page.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/account');
        });
}

module.exports = facebook;
