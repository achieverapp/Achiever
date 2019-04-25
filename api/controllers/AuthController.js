/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

//TODO: need comments explaining what is going on.

'use strict'

const axios = require('axios') // Axios is an HTTP library that we will make use of

const User = require('../models/UserModel.js').User;

// DEPLOYMENT: //
const clientID = 'e428572ccd0ee17f18f0'
const clientSecret = '6eb4d793045e9248ebb58b7e3fabc5380753abcf'

// DEVELOPMENT: //
// const clientID = 'd092b106e4dba55e7462' //ID codes for GitHub OAuth
// const clientSecret = '350e93a79aa2801a4a0a57e5b83516c7d02c92f3'

/**
 * Authentication handler for GitHub, handles requests made from the GitHub API.
 * Routes the user to the login page again if OAuth was unnsuccessful, or logs them in
 * and takes them to the tasklist page if authentication was successful
 */
exports.authenticate = function (req, res) {
    const requestToken = req.query.code //RequestToken from GitHub
    axios({ //Make an Axios call with the secret Key needed for Authentication
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        const accessToken = response.data.access_token //Retrieves the access Token from GitHub

        axios({ // Retrieve the information that the user told us we can se from gitHub
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: 'token ' + accessToken,
            }
        }).then((response) => {
            console.log(response.data)
            var user = {
                login: response.data.login
            }
            console.log(user)
            User.getUser(req.app.locals.users, user, function (result) {
                console.log(result);
                if (result.success) {
                    res.redirect(`/tasklist?userId=${result.objId}`)
                    console.log("USER FOUND!")
                } else {
                    User.addUser(req.app.locals.users, {
                        login: response.data.login,
                        name: response.data.name
                    }, function (result) {
                        if (result.success) {
                            res.redirect(`/tasklist?userId=${result.objId}`)
                        } else {
                            res.redirect(`/login`)
                        }
                    })
                }
            })
        })
    })
};

/**
 * Responsible for handling a GET request for 
 */
exports.getUserData = function (req, res) {
    var accessToken = req.query.accessToken;
    console.log(accessToken)
    axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            Authorization: 'token ' + accessToken,
        }
    }).then((response) => {
        res.json(response.data)
    })
}