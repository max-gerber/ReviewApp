const router = require('express').Router();
const passport = require('passport');

router.get('/42', passport.authenticate('42'));	//	Checks authentication of user and authenticates if not authenticated

router.get('/42/redirect', passport.authenticate('42'), (req, res) => {	//	Redirect URI. Here Passport creates a cookie containing the username of the user
    res.redirect('/auth/signed-in')
});

router.get('/signed-in', (req, res) => {	// This will hopefully be replaced by a method of redirecting the user to the URL they were trying to access before 
	if (!req.user){
		res.redirect('/auth/42');	//	If the user is not authenticated they are redirected to the authentication page
	}
	res.send("You weren't signed in but you are now, you may now re-navigate to the URL you were trying to access");
});

module.exports = router;