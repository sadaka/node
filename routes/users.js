var express = require('express');
var router = express.Router();
var path = require('path');

var mu = require('../models/users');
var helpers = require('../utility/helper');
var config = require('../config/config');
var pagination = require('pagination');

router.post('/login', function(req, res, next){
  mUsers = new mu(__myCon);
  mUsers.validateUser(req.body.email, req.body.password, function(err, data){
    if(!data[0]){
      res.locals.error= 'Email and password did not match!';
    }else{
      req.session.loggedIn = true;
      req.session.__user = data;
      req.session.__msg = 'User logged in successfully!';
      res.redirect('../');
    }
    res.render('./users/login',{email:req.body.email});
  });
  //~ next();
});

router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    
  });
  res.redirect('../');
});

router.get('/add', helpers.requiredLogin, function(req, res, next){
  res.render('./users/add', {error:req.session.__err, msg:req.session.__msg});
});

router.post('/add', helpers.requiredLogin, function(req, res, next){
  mUsers = new mu(__myCon);
  mUsers.save({name:req.body.name, email:req.body.email, password:req.body.password, address:req.body.address}, function(err, data){
    if(err){
      //~ req.session.__msg = null;
      req.session.__err = err.code;
      res.redirect('/users/add');
    }else{
      req.session.__err = null;
      req.session.__msg = 'User added successfully!';
      res.redirect('/users');
    }
  });
});

/* GET users listing. */
router.get('/*', helpers.requiredLogin, function(req, res, next) {
  mUsers = new mu(__myCon);
  var page = req.query.page || 1;
  
  mUsers.limit_start = (page - 1) * config.page_length;
  mUsers.limit_end = mUsers.limit_start + config.page_length;
  mUsers.no_of_records = 0;
  mUsers.findAll(function(err, rows){
    var obj = {};
    if(err){
      obj.err = 'Error in getting user records.';
    }else{
      obj.msg = res.__msg;
      obj.users = rows;
      obj.start = mUsers.limit_start;
    }    
    mUsers.getRecordsCount(function(err, data){    
      var paginator = new pagination.SearchPaginator({prelink:'/users/', current: page, rowsPerPage: config.page_length, totalResult: mUsers.no_of_records});
      obj.pages = paginator.render();
      res.render('./users/index', obj);
    });
  }.bind(this));
  
});


module.exports = router;
