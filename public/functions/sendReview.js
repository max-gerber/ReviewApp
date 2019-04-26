module.exports = {
    sendReview: (data) => {
        fetch('http://localhost:3000/api/reviews/addReview', {
            method: 'post',
            body: JSON.stringify({
                "data": data
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
    }
}