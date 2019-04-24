/*
    CptS 489, Spring 2019
    Project: Task Tracker
    File: server.js
*/

const express = require('express'); //we are using express.js to process GET and POST requests
const cors = require('cors') //used to allow cross-origin support
const app = express(); //instantiate an express app.
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser'); //bodyParser helps us to parse the bodies of incoming requests
const axios = require('axios')

const port = process.env.PORT || 3000; //create a port for listening for requests...

app.use(bodyParser.urlencoded({
    extended: true
})); //init body parser
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/app/public'));

var routes = require("./api/routes/routes"); //Define routes
routes(app); //Register routes with the app
var appRoutes = require('./app/appRoutes')
appRoutes(app);

const uri = "mongodb+srv://Achiever:HEAIj6ZA0Wvsx7X5@achiever-7tkct.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
client.connect(err => {
    const db = client.db('Achiever');

    //get the collections
    const users = db.collection('Users');
    const tasks = db.collection('Tasks');
    const timeblocks = db.collection('TimeBlocks');

    app.locals.users = users; //store users
    app.locals.tasks = tasks; //store tasks.
    app.locals.timeblocks = timeblocks; //store timeBlocks.

    app.listen(port); //Listens for requests (asynchronous!)

    console.log('Achiever API running on port: ' + port);
});