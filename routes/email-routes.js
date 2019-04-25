const router = require('express').Router();
const keys = require('../config/keys');
const postmark = require('postmark');
const bodyParser = require('body-parser');
const { getAllReviews } = require('../functions/getAllReviews');
const { checkCompletion } = require('../functions/checkCompletion');

const client = new postmark.Client(keys.postmark.token);

const urlencodedParser = bodyParser.urlencoded({
	extended: false
});

router.get('/', (req, res) => {
    res.render('email');
});

router.post('/', urlencodedParser, async (req, res) => {
    if (!req.body || !req.body.reviewer || !req.body.username || !req.body.projectName){
        return res.send('Something went wrong');
    };
    const reviewer = req.body.reviewer;
    const username = req.body.username;
    const projectName = req.body.projectName;
	const reviews = await getAllReviews(username, projectName);
    if (!reviews.data.getAllReviews[0]){
        return res.send('It seemes you have entered incorrect information');
    };
    const review = reviews.data.getAllReviews[0];
    if (await checkCompletion(review)){
        return res.send('This user has finished this project');
    };
    client.sendEmail({
        "From": "no-reply@wethinkcode.co.za",
        "To": `${reviewer}@student.wethinkcode.co.za`,
        "Subject": "Review Time",
        "TextBody": `Hello ${req.body.rev}, it's time for you to review ${username}'s ${projectName}.\nFollow this link to begin the review: http://localhost:4000/review?id=${review.id}`
    });
    return res.send('Email has been sent');
});

module.exports = router;