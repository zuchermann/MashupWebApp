var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
	var id = req.params.id;
	 Project.find(function(err, results) {
         if (err) { console.log(err); }

         res.send({ project: results });
     });
});

module.exports = router;