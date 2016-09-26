var MIDIParser = require('midi-parser-js/src/midi-parser').default


export default function($scope, Data, $document) {
	$scope.data = Data;

	let params = {
		url: "",
		audio: "",
		mashup: ""
	};
	
	$scope.songs = [{
		title: "Gymnopedie I",
		artist: "Satie"
	},
	{
		title: "Runaway",
		artist: "Del Shannon"
	}];

	$scope.play = () => {
		params.mashup = $scope.data.currentProj.melody + "-" + 
						$scope.data.currentProj.chords;
		params.url = require("file!./midi/" + params.mashup + ".mp3");
		params.audio = new Audio(params.url);
		params.audio.play();
	};

	$scope.pause = () => {
		params.audio.pause();
	};

	$scope.setMelody = (song) => {
		$scope.data.currentProj.melody = song.title;
	};

	$scope.setChords = (song) => {
		$scope.data.currentProj.chords = song.title;
	};

	$scope.isMelody = (song) => {
		return $scope.data.currentProj.melody === song.title;
	};

	$scope.isChords = (song) => {
		return $scope.data.currentProj.chords === song.title;
	};

	MIDIParser.addListener(document.getElementById('filereader'), function(obj){
		// Your callback function
		console.log(obj);
	});

	$scope.$on("$destroy", function(){
        $scope.pause();
    });


}