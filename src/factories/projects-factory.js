import _ from 'lodash';
import angular from 'angular';

const projectsFactory = angular.module('app.projectsFactory', [])

.factory('projectsFactory', ($http) => {
	function newProject($scope, params) {
		params.newHasInput = false;
		$scope.newProjectInput = '';
	}

	function deleteProject($scope, params, name) {
		var i = 0;
		var len = $scope.projects.length;
		for (; i < len; ) {
			if($scope.projects[i].name === name){
				$scope.projects.splice(i, 1);
				break;
			}
			i++;
		}
		params.newHasInput = false;
		$scope.newProjectInput = '';
	}

	function watchNewProjectInput($scope, params, val) {
		if(!val && params.newHasInput){
			$scope.projects.pop();
			params.newHasInput = false;
		}
		else if (val && !params.newHasInput) {
			$scope.projects.push({name: val, length: "0:00"});
			params.newHasInput = true;
		} else if (val && params.newHasInput){
			$scope.projects[$scope.projects.length - 1].name = val;
		}
	}

	// function getDateStr() {
	// 	var today = new Date();
	// 		var dd = today.getDate();
	// 		var mm = today.getMonth()+1; //January is 0!
	// 		var yyyy = today.getFullYear();

	// 		if(dd<10) {
	// 		    dd='0'+dd
	// 		}

	// 		if(mm<10) {
	// 		    mm='0'+mm
	// 		}

	// 		today = mm+'/'+dd+'/'+yyyy;
	// }



	return {
		newProject,
		deleteProject,
		watchNewProjectInput
	}
});

export default projectsFactory;