const router = require('express').Router();
const bodyParser = require('body-parser');
const { getReview } = require('../functions/getReview');
const { getAllReviews } = require('../functions/getAllReviews');
const { getProject } = require('../functions/getProject');
const { sendReview } = require('../functions/sendReview');
const { getComponents } = require('../functions/getComponents');


const urlencodedParser = bodyParser.urlencoded({
	extended: false
});

router.get('/', async (req, res) => {
	if (!req.user){
		return res.redirect('/auth/42');	//	If the user is not authenticated they are redirected to the authentication page
	}
	const userId = req.query.id;
	let review = await getReview(userId);
	if (!review.data.getReview){
		return res.send("You have an invalid review id");	//	If the id provided is not found in the database, users are directed away
	}
	review = review.data.getReview;
	const allReviews = await getAllReviews(review.username, review.projectName);
	if (review.date != allReviews.data.getAllReviews[0].date){
		return res.send("You appear to have an old review id");	// If the id provided is not for the last review added, users are directed away
	}
	const project = await getProject(review.projectName);
	const components = getComponents(project.data.getProject.project_structure);
	res.render("review", {
		review,
		components
	});
});

router.post('/', urlencodedParser, (req, res) => {
	if (!req.user){
		return res.redirect('/auth/42');
	}
	if (!req.body || !req.body.username || !req.body.project || !req.body.comment){
		return res.send("Something went wrong");	//	If the review sent doesn't contain all the necessary data, users are directed away 
	}
	console.log(req.body);	
	const newReview = {	//	Data from the front-end is formated
		completion: Object.keys(req.body).length - 3,
		username: req.body.username,
		assessor: req.user,
		projectName: req.body.project,
		comment: req.body.comment,
		date: Date.now().toString(10)
	};	
	sendReview(newReview);	//	Review data is sent to the API and added to the database
	return res.send("Review proccessed");
});

module.exports = router;