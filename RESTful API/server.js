/*
    CptS 489, Spring 2019
    Project: Task Tracker
    File: server.js    
*/
/*
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
*/
//mongo the above was for sql.
const express = require('express'); //we are using express.js to process GET and POST requests
const app = express(); //instantiate an express app.
const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser'); //bodyParser helps us to parse the bodies of incoming requests
const port = process.env.PORT || 3000; //create a port for listening for requests...

app.use(bodyParser.urlencoded({extended: true})); //init body parser
app.use(bodyParser.json());

var routes = require("./routes/userRoutes"); //Define  routes 
//var routesTask=require("./routes/taskRoutes")
routes(app); //Register routes with the app
//routesTask(app);
MongoClient.connect("mongodb://localhost:27017/TaskManager",

                    {useNewUrlParser: true})

.then(client => {

    const db = client.db('TaskManager');

    //get the collections
    const users = db.collection('Users');
    const tasks=db.collection('Tasks');

    //for milestone 2 we are focusing on is users and task
    app.locals.users = users; //store users
    app.locals.tasks = tasks; //store tasks


    app.listen(port); //Listens for requests (asynchronous!)

    console.log('Task Manager db connected in ' + port);

}).catch(error => console.error(error));