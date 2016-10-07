var MIDIParser = require('midi-parser-js/src/midi-parser').default;
var SmfParser = require("./smf/smfParser").default;
var SmfPlayer = require("./smf/smfPlayer").default;
var synth = require("./smf/webmidilinkSender.js").default;


export default function($scope, Data, $document, $http) {
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
		//params.url = require("file!./midi/" + params.mashup + ".mp3");
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

	$scope.playCogs = () => {
		var midi_file;
		var webMidiLinkSynth=[
		{
			"id":"wml00", "version": 1, "manufacturer":"g200kg",
			"name":"[Experimental] GMPlayer (Web MIDI Link)",
			"url":"//webmusicdevelopers.appspot.com/webtg/gmplayer/index.html",
       		 //"url":"//www.g200kg.com/webmidilink/gmplayer/",
        	"size":"width=600,height=600,scrollbars=yes,resizable=yes"
   		},
    	{
    		"id":"wml01", "version": 1, "manufacturer":"Logue",
    		"name":"[Experimental] SoundFont: Yamaha XG (Web MIDI Link)",
    		"url":"//logue.github.io/smfplayer.js/wml.html",
    		"size":"width=600,height=600,scrollbars=yes,resizable=yes"
    	}];
    	var sdata=webMidiLinkSynth[0];
    	synth.Load(sdata.url, sdata.id, sdata.size, "webmidilink");
    	var midiout={
            "id": null,
            "manufacturer": sdata.manufacturer,
            "name": sdata.name,
            "type": "output",
            "version": sdata.version,
            "send": null
        };

        var smfPlayer=new SmfPlayer(midiout);

        midiout.send=function(msg, time) {
            // time must be converted from absolite time to relative time.
            // Web MIDI API handles absolute time, but Web MIDI Links needs relative time.
            var aTime;
            aTime=time-(window.performance.now()-smfPlayer.startTime)-smfPlayer.startTime+smfPlayer.latency;
            if(typeof msg=="object") {
                for(var i=0; i<msg.length; i++) {
                    msg[i]=msg[i].toString(16).replace("0x", "");
                }
            }
            var out="midi,"+msg.join(",");
            synth.send(out, aTime);
                
        };

    	$http.get('/songs/Cogs.mid').success(response => {
    		midi_file = response.midi;
    		var smfParser = new SmfParser();
    		var parsedSmf = smfParser.parse(midi_file);
    		smfPlayer.init( parsedSmf, 0, 0 );
    		smfPlayer.startPlay();
    	});
	};

	MIDIParser.addListener(document.getElementById('filereader'), function(obj){
			// Your callback function
			console.log(obj);
	});

	$scope.$on("$destroy", function(){
		$scope.pause();
	});


}