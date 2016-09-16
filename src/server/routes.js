var projectsRoutes = require('server/projects/routes');

module.exports = function routes(app) {
	app.use('/projects', projectsRoutes);
};