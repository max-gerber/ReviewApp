const { getProject } = require('../functions/getProject');
const { getComponents } = require('../functions/getComponents');

module.exports = {
    checkCompletion: async (review) => {
        const project = await getProject(review.projectName);
        const components = getComponents(project.data.getProject.project_structure);
        let taskNumber = 0;
        for (let i = 0; i < components.length; i++){
            taskNumber += components[0].tasks.length;
        };
        if (review.completion == taskNumber){
            return true;
        };
        return false;
    }
}