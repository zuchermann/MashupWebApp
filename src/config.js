import angular from 'angular';
import uiRouter from 'angular-ui-router';
import projectsFactory from 'factories/projects-factory';
import projectsController from "projects/projects";
import editController from "edit/edit";
import authenticateController from "authenticate/authenticate";

const app = angular.module('app', [uiRouter, projectsFactory.name]);
app.factory('Data', function() {
	return {
		currentProj: {},
		isAuthenticated: false
	};
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
		.state('authenticate', {
			url: '/authenticate',
			template: require('authenticate/authenticate.html'),
			controller: authenticateController
		})

	$locationProvider.html5Mode(true);
});

export default app