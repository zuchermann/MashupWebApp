import angular from 'angular';
import uiRouter from 'angular-ui-router';
import projectsController from "projects/projects";
import editController from "edit/edit";

const app = angular.module('app', [uiRouter]);
app.factory('Data', function() {
	return {currentProj: {}};
});

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('projects',{
			url: '/',
			template: require('projects/projects.html'),
			controller: projectsController
		})
		.state('about', {
			url: '/about',
			template: require('about/about.html')
		})
		.state('edit', {
			url: '/edit',
			template: require('edit/edit.html'),
			controller: editController
		})

	$locationProvider.html5Mode(true);
});

export default app