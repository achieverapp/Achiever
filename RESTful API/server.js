/*
    CptS 489, Spring 2019
    Project: Task Tracker
    File: server.js    
*/

var express = require('express'); //we are using express.js to process GET and POST requests
var app = express(); //instantiate an express app.
var bodyParser = require('body-parser'); //bodyParser helps us to parse the bodies of incoming requests
var port = process.env.PORT || 3000; //create a port for listening for requests...

// declare constant pieces that will be used throughout the server here.
// Maybe have a user/task class
// const SGS = require('../SGS.js');

app.use(bodyParser.urlencoded({ extended: true })); //init body parser
app.use(bodyParser.json());

const { connection } = require('./models/Db'); //init database connection

var routes = require("./routes/apiRoutes"); //Define  routes 
routes(app); //Register routes with the app
app.listen(port); //Listens for requests (asynchronous!)
console.log('Achiever RESTful API server started on local port ' + port);