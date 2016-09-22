import _ from 'lodash';
import angular from 'angular';

const projectsFactory = angular.module('app.projectsFactory', [])

.factory('projectsFactory', ($http) => {
	
	function getProjects($scope) {
        $http.get('/projects').success(response => {
            $scope.projects = response.project;
        });
    }

	function newProject($scope, params) {
		if (!$scope.newProjectInput) { return; }

        $http.post('/projects', {
            name: $scope.newProjectInput,
            length: '0:00',
            modified: new Date()
        }).success(response => {
            getProjects($scope);
            $scope.newProjectInput = '';
        });
	}

	function deleteProject($scope, params, toDelete) {

		$http.delete(`/projects/${toDelete._id}`).success(response => {
            getProjects($scope);
            params.newHasInput = false;
            $scope.newProjectInput = '';
        });

		// var i;
		// var len = $scope.projects.length;
		// for (i = 0; i < len; i++) {
		// 	if($scope.projects[i].name === name){
		// 		$scope.projects.splice(i, 1);
		// 		break;
		// 	}
		// 	i++;
		// }
		// params.newHasInput = false;
		// $scope.newProjectInput = '';
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
		getProjects,
		newProject,
		deleteProject,
		watchNewProjectInput
	}
});

export default projectsFactory;