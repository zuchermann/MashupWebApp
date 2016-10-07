var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:id', function(req, res) {
	var id = req.params.id;
	location = __dirname + "/" + id;

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