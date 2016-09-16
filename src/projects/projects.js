export default function($scope, Data) {
let params = {
	newHasInput: false,
};

	$scope.data = Data;

	$scope.projects = [
	{
		name: 'project 1',
		length: '0:00',
		modified: '09/09/2016'
	},
	{
		name: 'project 2',
		length: '0:00',
		modified: '09/09/2016'
	}
	];

	$scope.$watch('newProjectInput', (val) => {
		if(!val && params.newHasInput){
			$scope.projects.pop();
			params.newHasInput = false;
		}
		else if (val && !params.newHasInput) {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			}

			if(mm<10) {
			    mm='0'+mm
			}

			today = mm+'/'+dd+'/'+yyyy;
			$scope.projects.push({name: val, length: "0:00", modified: today});
			params.newHasInput = true;
		} else if (val && params.newHasInput){
			$scope.projects[$scope.projects.length - 1].name = val;
		}
	});

	$scope.newProject = () => {
		params.newHasInput = false;
		$scope.newProjectInput = '';
	};

	$scope.deleteProject = (name) => {
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
	};

	$scope.setCurrentProj = (proj) => {
		$scope.data.currentProj = proj;
	};
}