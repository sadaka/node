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
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.email = data.email;
    res.locals.password = data.password;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }
  res.render('./users/add');
});

router.post('/add', helpers.requiredLogin, function(req, res, next){
  mUsers = new mu(__myCon);
  var usersData = {name:req.body.name, email:req.body.email, password:req.body.password, address:req.body.address};
  mUsers.save(usersData, function(err, data){
    if(err){
      req.session.tmp = usersData;
      req.session.__err = err.code;
      res.redirect('/users/add');
    }else{
      req.session.__msg = 'User added successfully!';
      res.redirect('/users');
    }
  });
});

router.get('/del/:id', helpers.requiredLogin, function(req, res, next){
  mUsers = new mu(__myCon);  
  mUsers.deleteById(req.params.id, function(err, data){
    if(err){
      req.session.__err = err.code;
      res.redirect('/users');
    }else{
      req.session.__msg = 'User deleted succesfully!';
      res.redirect('/users');
    }
  });
});

router.get('/edit/:id', helpers.requiredLogin, function(req, res, next){
  mUsers = new mu(__myCon);  
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.email = data.email;
    res.locals.password = data.password;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }else{
  
    mUsers.findById(req.params.id, function(err, data){
      if(err){
        req.session.__err = err.code;
        res.redirect('/users');
      }else{
        res.render('./users/edit', {email:data[0].email, name:data[0].name, address:data[0].address, id:data[0].id});
      }
    });
  }
});

router.post('/edit/:id', helpers.requiredLogin, function(req, res, next){
  mUsers = new mu(__myCon);
  var usersData = {name:req.body.name, email:req.body.email, address:req.body.address};
  mUsers.update(req.params.id, usersData, function(err, data){
    if(err){
      req.session.__err = err.code;
      res.redirect('/users/edit/'+req.params.id);
    }else{
      req.session.__err = null;
      req.session.__msg = 'Use details edited successfully!';
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
    console.log(rows);
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
