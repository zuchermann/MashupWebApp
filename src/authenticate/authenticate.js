import _ from 'lodash';

export default function($scope, $location, Data, projectsFactory) {
	$scope.data = Data;

	$scope.authenticate = () => {
		console.log("AUTHENTICATED");
		$scope.data.isAuthenticated = true;
		$location.path('projects');
	}
}