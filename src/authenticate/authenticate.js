import _ from 'lodash';

export default function($scope, Data, projectsFactory) {
	$scope.data = Data;

	$scope.authenticate = () => {
		console.log("AUTHENTICATE");
	}
}