const passport = require('passport');
const ft_Strategy = require('passport-42').Strategy;
const keys = require('./keys');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new ft_Strategy({
        callbackURL: 'http://localhost:4000/auth/42/redirect',
        clientID: keys[42].clientID,
        clientSecret: keys[42].clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile.username);
    }),
);