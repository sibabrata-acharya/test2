// dependencies
var passport = require('passport');
var config = require('./config.json');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `done`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(request, accessToken, refreshToken, profile, done) {
        // In this example, the user's Google profile is supplied as the user
        // record.  In a production-quality application, the Google profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return done(null, profile);
    }
));

function google(app){
    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in google authentication will involve
    //   redirecting the user to google.com.  After authorization, google will
    //   redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', { scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ] }),
        function(req, res){
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        }
    );

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the account page.
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/account');
        }
    );
}

module.exports = google;
