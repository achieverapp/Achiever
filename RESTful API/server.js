/*
    CptS 489, Spring 2019
    Project: Task Tracker
    File: server.js    
*/

const express = require('express'); //we are using express.js to process GET and POST requests
const app = express(); //instantiate an express app.
const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser'); //bodyParser helps us to parse the bodies of incoming requests
const port = process.env.PORT || 3000; //create a port for listening for requests...

app.use(bodyParser.urlencoded({
    extended: true
})); //init body parser
app.use(bodyParser.json());

var routes = require("./routes/routes"); //Define routes
//var routesTask=require("./routes/taskRoutes")
routes(app); //Register routes with the app
//routesTask(app);
MongoClient.connect("mongodb://localhost:27017/Achiever", {
    useNewUrlParser: true
}).then(client => {
    const db = client.db('Achiever');

    //get the collections
    const users = db.collection('Users');
    const tasks = db.collection('Tasks');

    //for milestone 2 we are focusing on is users and task
    app.locals.users = users; //store users
    app.locals.tasks = tasks; //store tasks.

    app.listen(port); //Listens for requests (asynchronous!)

    console.log('Achiever API running on port: ' + port);
}).catch(error => console.error(error));