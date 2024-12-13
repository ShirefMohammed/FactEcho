import dotenv from "dotenv";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/login/google/callback`,
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, profile, cb) => {
      try {
        return cb(null, profile);
      } catch (error) {
        return cb(error, undefined);
      }
    },
  ),
);

// Facebook OAuth setup
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/login/facebook/callback`,
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, public_profile, cb) => {
      try {
        return cb(null, public_profile);
      } catch (error) {
        return cb(error, undefined);
      }
    },
  ),
);

passport.serializeUser((_user, cb) => cb(null, null)); // No-op
passport.deserializeUser((_id, cb) => cb(null, null)); // No-op
