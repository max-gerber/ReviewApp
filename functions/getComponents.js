module.exports = {
    getComponents: (project) => {
	    let componentList = [];
	    for (var i = 0; i < project.length; i++){
	    	let component = {
	    		component: project[i].component,
	    		tasks: project[i].tasks
	    	};
	    	componentList.push(component);	//	An array of objects each relating to the project's component is created to be sent to the front-end
        };
        return componentList;
    }
}