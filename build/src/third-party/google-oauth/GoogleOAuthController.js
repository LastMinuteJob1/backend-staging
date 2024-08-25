"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthController = void 0;
const GoogleOauthService_1 = require("./GoogleOauthService");
class GoogleOAuthController {
    constructor() {
        this.googleOauthAuthService = new GoogleOauthService_1.GoogleOAuthService();
        this.firebase_verification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.googleOauthAuthService.firebaseIdTokenVerification(req.body.token_id));
        });
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
}
exports.GoogleOAuthController = GoogleOAuthController;
