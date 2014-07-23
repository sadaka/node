//~ var express = require('express');

function requiredLogin(req, res, next){
  if(!req.session.loggedIn)
    res.redirect('../');
    next();
}

module.exports.requiredLogin = requiredLogin;
