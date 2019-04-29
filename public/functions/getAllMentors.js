module.exports = {
    getAllMentors : async () => {
        return new Promise(resolve => {
            fetch('http://localhost:3000/api/allmentors', {
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
    }
}