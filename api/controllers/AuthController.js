/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

'use strict'

const axios = require('axios')

const User = require('../models/UserModel.js').User;

const clientID = 'd092b106e4dba55e7462'
const clientSecret = '350e93a79aa2801a4a0a57e5b83516c7d02c92f3'

exports.authenticate = function (req, res) {
    const requestToken = req.query.code
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        const accessToken = response.data.access_token

        axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: 'token ' + accessToken,
            }
        }).then((response) => {
            console.log(response.data)
            var user = { login: response.data.login }
            console.log(user)
            User.getUser(req.app.locals.users, user, function(result) {
                console.log(result);
                if(result.success) {
                    res.redirect(`/tasklist?userId=${result.objId}`)
                    console.log("USER FOUND!")
                }
                else {
                    User.addUser(req.app.locals.users, { login: response.data.login, name: response.data.name }, function(result) {
                        if(result.success) {
                            res.redirect(`/tasklist?userId=${result.objId}`)
                        }
                        else {
                            res.redirect(`/login`)
                        }
                    })
                }
            })
        })
    })
};

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