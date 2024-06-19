export class GoogleOAuthController {

/*
// Google Oauth
const session = require('express-session'), passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: JWT_SECRET_KEY
}));

// setting up passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send({msg: "Thank you for signing up"}));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user:any, cb:any) {
  cb(null, user);
});

passport.deserializeUser(function(obj:any, cb:any) {
  cb(null, obj);
});

// Main Google OAUTH
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken:any, refreshToken:any, profile:any, done:any) {
    //   userProfile=profile;
      return done(null, profile);
  }
));
 
//  Web sign-up
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
*/

}