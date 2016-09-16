var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/projects');

var Project = mongoose.model('Project', {
	name: String,
	length: String,
	modified: String
});

module.exports.Project = Project;