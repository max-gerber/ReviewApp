module.exports = {
    getProject: async (projectName) => {
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
    }
}