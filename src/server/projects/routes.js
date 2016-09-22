var mongoose = require('mongoose');
var Project = require('server/db/db').Project;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	 Project.find(function(err, results) {
         if (err) { console.log(err); }

         res.send({ project: results });
     });
});

router.post('/', function(req, res) {
	var project = new Project(req.body);
	project.save(function(err) {
		if (err) {console.log(err);}

		res.send("project saved");
	});
});

router.put('/:id', function(req, res) {
	var l = req.params.id;
	Project.update({ _id: mongoose.Types.ObjectId(id) }, {
		$set: { name: req.body.name } 
	}, function(err) {
		if (err) {console.log(err);}

		res.send('project updated');
	});
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    Project.remove({ _id: mongoose.Types.ObjectId(id) }, function(err) {
        if (err) { console.log(err); }

        res.send('project deleted');
    });
});

module.exports = router;