const postmark = require('postmark');
const keys = require('../../config/keys');
const { getAllReviews } = require('./getAllReviews');
const { getTeam } = require('./getTeam');
const { getMentor } = require('./getMentor');

const client = new postmark.Client(keys.postmark.token);

module.exports = {
    sendMentorEmail: async (username ) => {
        let mentor = await getMentor(username);
        let teams = [];
        let members = [];
        let reviews = [];
        let email = '';
        
        mentor = mentor.data.getMentor;
        for (let i = 0; i < mentor.teams.length; i++){
            let team = await getTeam(mentor.teams[i]);
            teams.push(team.data.getTeam);
        };
        for (let i = 0; i < teams.length; i++){
            for (let j = 0; j < teams[i].members.length; j++){
                members.push(teams[i].members[j]);
            };
        };
        for (let i = 0; i < members.length; i++){
            let review = await getAllReviews(members[i].username, members[i].projectName);            
            reviews.push(review.data.getAllReviews[0]);
        };
        for (let i = 0; i < reviews.length; i++){
            email = email.concat(`${reviews[i].username}'s ${reviews[i].projectName} - http://localhost:4000/review?id=${reviews[i].id} \n`)
        };
        client.sendEmail({
            "From": "no-reply@wethinkcode.co.za",
            "To": `${username}@student.wethinkcode.co.za`,
            "Subject": "Review Time",
            "TextBody": `Hello ${username}, it's time for you to review:\n\n${email}`
        });
    }
};