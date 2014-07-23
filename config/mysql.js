var express = require('express');
var mysql = require('mysql');

connection = function(host, user, password, database){
  var connection = mysql.createConnection({
    'host':host,
    'user':user,
    'password':password
  });
  
  connection.connect();
  connection.query('use '+database);
  //~ this.prototype.connection = connection;
  return connection;
};
module.exports = connection;
