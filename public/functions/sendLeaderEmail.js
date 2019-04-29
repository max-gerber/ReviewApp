const postmark = require('postmark');
const keys = require('../../config/keys');
const { getAllReviews } = require('./getAllReviews');

const client = new postmark.Client(keys.postmark.token);

module.exports = {
    sendLeaderEmail: async (team) => {
        let members = [];
        let reviews = [];
        let email = '';
        for (let i = 0; i < team.members.length; i++){
            members.push(team.members[i]);
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
            "To": `${team.teamLeader}@student.wethinkcode.co.za`,
            "Subject": "Review Time",
            "TextBody": `Hello ${team.teamLeader}, it's time for you to review:\n\n${email}`
        });
    }
};