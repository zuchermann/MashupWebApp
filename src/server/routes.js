var projectsRoutes = require('server/projects/routes');
var songRoutes = require('server/songs/routes');

module.exports = function routes(app) {
	app.use('/projects', projectsRoutes);
	app.use('/songs', songRoutes);
};