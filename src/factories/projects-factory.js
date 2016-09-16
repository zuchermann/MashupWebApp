import _ from 'lodash';
import angular from 'angular';

const projectsFactory = angular.module('app.projectsFactory', [])

.factory('projectsFactory', () => {
	function newProject() {
		return true;
	}

	return {
		newProject
	}
});

export default projectsFactory;