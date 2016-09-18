import _ from 'lodash';

export default function($scope, Data, projectsFactory) {
	let params = {
		newHasInput: false,
	};

	$scope.data = Data;

	$scope.projects = [
	{
		name: 'project 1',
		length: '0:00',
		melody: '',
		chords: ''
	},
	{
		name: 'project 2',
		length: '0:00',
		melody: '',
		chords: ''
	}
	];

	

	$scope.setCurrentProj = (proj) => {
		$scope.data.currentProj = proj;
	};

	$scope.$watch('newProjectInput', _.partial(projectsFactory.watchNewProjectInput, $scope, params));
	$scope.newProject = _.partial(projectsFactory.newProject, $scope, params);
	$scope.deleteProject = _.partial(projectsFactory.deleteProject, $scope, params);
}