var mongoose = require('mongoose');
var Project = require('server/db/db').Project;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('HELLO FROM PROJECTS');
});

router.post('/', function(req, res) {
	var project = new Project(req.body);
	Project.save(function(err) {
		if (err) {console.log(err);}

		res.send("project saved");
	});
});

router.put('/:id', function(req, res) {
	var id = req.params.id;
	Project.update({ _id: mongoose.Types.ObjectId(id) }, {
		$set: { task: req.body.task } 
	}, function(err) {
		if (err) {console.log(err);}

		res.send('project updated');
	});
});

module.exports = router;