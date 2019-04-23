const express = require('express');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport')
require('isomorphic-fetch');
require('./config/passport-setup');

const app = express();
const urlencodedParser = bodyParser.urlencoded({
	extended: false
});

app.set('view engine', 'ejs');

app.use(cookieSession({
	maxAge: 24 * 60 * 60,
	keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());

app.use(passport.session());

app.get('/auth/42', passport.authenticate('42'));

app.get('/auth/42/redirect', passport.authenticate('42'), (req, res) => {
    res.redirect('/signed-in')
});

app.get('/signed-in', (req, res) => {
	if (!req.user){
		res.redirect('/auth/42');
	}
	res.send("You weren't signed in but you are now, you may now re-navigate to the URL you were trying to access");
});

app.get('/review', async (req, res) => {
	if (!req.user){
		return res.redirect('/auth/42');
	}
	const userId = req.query.id;
	let review = await getReview(userId);
	if (!review.data.getReview){
		return res.send("You have an invalid review id");
	}
	review = review.data.getReview;
	const allReviews = await getAllReviews(review.username, review.projectName);
	if (review.date != allReviews.data.getAllReviews[0].date){
		return res.send("You appear to have an old review id");
	}
	let project = await getProject(review.projectName);
	project = project.data.getProject.project_structure;
	let componentList = [];
	for (var i = 0; i < project.length; i++){
		let component = {
			component: project[i].component,
			tasks: project[i].tasks
		};
		componentList.push(component);
	};
	res.render("review", {
		review,
		componentList
	});
});

app.post('/review', urlencodedParser, (req, res) => {
	if (!req.body || !req.body.username || !req.body.project || !req.body.comment){
		return res.send("Something went wrong");
	}
	const newReview = {
		completion: Object.keys(req.body).length - 3,
		username: req.body.username,
		assessor: req.user,
		projectName: req.body.project,
		comment: req.body.comment,
		date: Date.now().toString(10)
	};
	sendReview(newReview);
});

app.listen(4000, () => {
	console.log("listening on port 4000");
});

async function getReview(id) {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/reviews?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(res => {
            resolve(res);
        }).catch(error => {
            throw error;
        });
    });
};

async function getAllReviews(username, projectName) {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/allreviews?username=${username}&projectName=${projectName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(res => {
            resolve(res);
        }).catch(error => {
            throw error;
        });
    });
};

async function getProject(projectName) {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/projects?project_name=${projectName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(res => {
            resolve(res);
        }).catch(error => {
            throw error;
        });
    });
};

function sendReview(data) {
	fetch('http://localhost:3000/api/reviews/addReview', {
		method: 'post',
		body: JSON.stringify({
			"data": data
		}),
		headers: {
			'content-type': 'application/json'
		}
	}).then(response => response.json())
};
