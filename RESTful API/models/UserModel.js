/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'user strict';
//var noSql = require('./noSqlDb.js');
var ObjectId = require('mongodb').ObjectId;

var User=function(Users)
{
this.name=Users.name;
this.id=Users.id;
}




Users.addUser=function(Users,userName,result)
{
Users.find({name: userName.name}).toArray(function(err,res)
{
    if(err)
    {

    }
})
}


Users.getUser=function(Users,UserId,result)
{

}

Users.updateUser=function(Users,UserId,result)
{

}


Users.deleteUser=function(Users,UserId,result)
{

}

