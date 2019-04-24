const express = require('express');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const reviewRoutes = require('./routes/review-routes');
const emailRoutes = require('./routes/email-routes');
const postmark = require('postmark');
require('isomorphic-fetch');
require('./config/passport-setup');

const app = express();

app.set('view engine', 'ejs');

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,	//	Cookies last for one day
	keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());

app.use(passport.session());

app.use('/auth', authRoutes);	//	All authentication routes are handled in routes/auth-routes

app.use('/review', reviewRoutes);	//	All review routes are handled in routes/review-routes

app.use('/email', emailRoutes);

app.listen(4000, () => {
	console.log("listening on port 4000");
});