const router = require('express').Router();
const bodyParser = require('body-parser');
const { getAllMentors } = require('../functions/getAllMentors');
const { getAllTeams} = require('../functions/getAllTeams');
const { sendMentorEmail } = require('../functions/sendMentorEmail');
const { sendLeaderEmail } = require('../functions/sendLeaderEmail');

const urlencodedParser = bodyParser.urlencoded({
	extended: false
});

router.get('/mentor', async (req, res) => {
    let mentors = await getAllMentors();
    mentors = mentors.data.getAllMentors;

    for (let i = 0; i < mentors.length; i++){
        sendMentorEmail(mentors[i].username);
    }
    return res.send('Emails have been sent');
});

router.get('/leader', async (req, res) => {
    let teams = await getAllTeams();
    teams = teams.data.getAllTeams;
    console.log(teams);
    

    for (let i = 0; i < teams.length; i++){
        sendLeaderEmail(teams[i]);
    }
    return res.send('Emails have been sent');
});

module.exports = router;