var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/projects');

var project = mongoose.model('Project', {
    name: String,
	length: String,
	modified: {type: Date, default: Date.now}
});

module.exports.Project = project;