var url = require("file!./midi/runaway_gymnopedie.mp3");

export default function($scope, Data) {
	$scope.data = Data;
	var audio = new Audio(url);

	$scope.play = () => {
		audio.play();
	}

	$scope.pause = () => {
		audio.pause();
	}
}