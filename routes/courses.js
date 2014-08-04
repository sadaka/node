var express = require('express');
var router = express.Router();
var path = require('path');

var modl = require('../models/courses');
var helpers = require('../utility/helper');
var config = require('../config/config');
var pagination = require('pagination');


router.get('/add', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.level_id = data.level_id;
    req.session.destroy(function(err){});
  }
  
  objModel.levelsList(function(err, data){
    if(err){
    }else{
      res.locals.ps = data;
      res.render('./courses/add');  
    }
  });
});

router.post('/add', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  var objData = {name:req.body.name, level_id:req.body.level_id};
  objModel.save(objData, function(err, data){
    if(err){
      req.session.tmp = objData;
      req.session.__err = err.code;
      res.redirect('/courses/add');
    }else{
      req.session.__msg = 'Course added successfully!';
      res.redirect('/courses');
    }
  });
});

router.get('/del/:id', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);  
  objModel.deleteById(req.params.id, function(err, data){
    if(err){
      req.session.__err = err.code;
      res.redirect('/institutions');
    }else{
      req.session.__msg = 'Institute deleted succesfully!';
      res.redirect('/institutions');
    }
  });
});

router.get('/edit/:id', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);  
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.level_id = data.level_id;
    req.session.destroy(function(err){});
  }else{
  
    objModel.findById(req.params.id, function(err, data){
      if(err){
        req.session.__err = err.code;
        res.redirect('/courses');
      }else{
        objModel.levelsList(function(err, data1){
          if(err){
          }else{
            res.locals.levels = data1;
            res.render('./courses/edit', {name:data[0].name, id:data[0].id, level_id:data[0]['level_id']});
          }
        });
      }
    });
  }
});

router.post('/edit/:id', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  var instData = {name:req.body.name, level_id:req.body.level_id};
  objModel.update(req.params.id, instData, function(err, data){
    if(err){
      req.session.__err = err.code;
      res.redirect('/courses/edit/'+req.params.id);
    }else{
      req.session.__err = null;
      req.session.__msg = 'Course details edited successfully!';
      res.redirect('/courses');
    }
  });
});

/* GET users listing. */
router.get('/*', helpers.requiredLogin, function(req, res, next) {
  objModel = new modl(__myCon);
  var page = req.query.page || 1;
  
  objModel.limit_start = (page - 1) * config.page_length;
  objModel.limit_end = objModel.limit_start + config.page_length;
  objModel.no_of_records = 0;
  objModel.findAll(function(err, rows){
    var obj = {};
    if(err){
      obj.err = 'Error in getting course records.';
    }else{
      obj.msg = res.__msg;
      obj.rows = rows;
      console.log(rows);
      obj.start = objModel.limit_start;
    }    
    objModel.getRecordsCount(function(err, data){    
      var paginator = new pagination.SearchPaginator({prelink:'/courses/', current: page, rowsPerPage: config.page_length, totalResult: objModel.no_of_records});
      obj.pages = paginator.render();
      res.render('./courses/index', obj);
    });
  }.bind(this));
  
});


module.exports = router;
