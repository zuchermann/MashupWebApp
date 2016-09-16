var express = require('express');
var bodyParser = require('body-parser');
var routes = require('server/routes');

var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.all('/*', function(req, res){
	res.send('\
		<!DOCTYPE html>\
		<html>\
			<head>\
				<title>Mashup App</title>\
				<base href="/">\
				<body>\
					<div ui-view></div>\
					<script src="bundle.js"></script>\
				</body>\
			</head>\
		</html>\
		');
});

app.listen(PORT, function() {
	console.log("Server running on port " + PORT);
});