var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var spawn = require('child_process').spawn;



router.get('/mashup/:id', function(req, res) {
	var id = req.params.id;
	var id_arr = id.split('');
	var i;
	var num_str = '';
	var song1 = '';
	var song2 = '';

	for (i=0;i<id.length;i++) {
		if(id_arr[i] === '$'){
			var start = i+1;
			num = Number(num_str);
			song1 = id.substring(start, start+num);
			start = start+num;
			song2 = id.substring(start, id.length);
			break;
		}
		else {
			num_str = num_str + id_arr[i];
		}
	}

	var paths={
		song1: __dirname+"/files/"+song1,
		song2: __dirname+"/files/"+song2,
		destination: __dirname+"/"+"zk.mashup.destination.mid"
	};

	py = spawn('python', ['mashup.py']);
	var out_str = "";

	py.stdout.on('data', function(data){
		out_str += data.toString();
	});
	py.stdout.on('end', function(){
		fs.readFile(paths.destination, "binary", function (err,data) {
			if (err) {
				return console.log(err);
			}
			res.send({
				midi: data
			});
		});
	});
	console.log("stringify " + JSON.stringify(paths));
	py.stdin.write(JSON.stringify(paths));
	py.stdin.end();

});

router.get('/', function(req, res) {
	var songs = fs.readdirSync(__dirname+"/files");
	data=[];
	var i;
	for(i=0;i<songs.length;i++){
		if(songs[i].split('')[0] != '.'){
			var song = {};
			var location = __dirname + "/files/" + songs[i];
			song.title = songs[i].replace(/\.[^/.]+$/, "");
			song.file = songs[i];
			song.path = location;
			data.push(song);
		}
	}
	res.send({data: data});
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	location = __dirname + "/files/" + id;

	fs.readFile(location, "binary", function (err,data) {
		if (err) {
			return console.log(err);
		}
		res.send({
			midi: data
		});
	});
});

module.exports = router;