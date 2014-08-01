var express = require('express');
var router = express.Router();
var path = require('path');

var modl = require('../models/levels');
var helpers = require('../utility/helper');
var config = require('../config/config');
var pagination = require('pagination');


router.get('/add', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.type = data.type;
    res.locals.parent_id = data.parent_id;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }
  
  objModel.parentsList(function(err, data){
    if(err){
    }else{
      res.locals.ps = data;
      res.render('./levels/add');  
    }
  });
});

router.post('/add', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  var objData = {name:req.body.name, level:req.body.level, parent_id:req.body.parent_id};
  var type = (req.body.parent_id != 0)?'child':'parent';
  objData.type = type;
  objModel.save(objData, function(err, data){
    if(err){
      req.session.tmp = objData;
      req.session.__err = err.code;
      res.redirect('/levels/add');
    }else{
      req.session.__msg = 'Level added successfully!';
      res.redirect('/levels');
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
    res.locals.parent_id = data.parent_id;
    res.locals.type = data.type;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }else{
  
    objModel.findById(req.params.id, function(err, data){
      if(err){
        req.session.__err = err.code;
        res.redirect('/institutions');
      }else{
        objModel.list(function(err, data1){
          if(err){
          }else{
            res.locals.ps = data1;
            res.locals.types = objModel.getTypes();
            res.render('./institutions/edit', {type:data[0].type, name:data[0].name, address:data[0].address, id:data[0].id, parent_id:data[0]['parent_id']});
          }
        });
      }
    });
  }
});

router.post('/edit/:id', helpers.requiredLogin, function(req, res, next){
  objModel = new modl(__myCon);
  var instData = {name:req.body.name, type:req.body.type, parent_id:req.body.parent_id, address:req.body.address};
  objModel.update(req.params.id, instData, function(err, data){
    if(err){
      req.session.__err = err.code;
      res.redirect('/institutions/edit/'+req.params.id);
    }else{
      req.session.__err = null;
      req.session.__msg = 'Institute details edited successfully!';
      res.redirect('/institutions');
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
      obj.err = 'Error in getting level records.';
    }else{
      obj.msg = res.__msg;
      obj.levels = rows;
      console.log(rows);
      obj.start = objModel.limit_start;
    }    
    objModel.getRecordsCount(function(err, data){    
      var paginator = new pagination.SearchPaginator({prelink:'/levels/', current: page, rowsPerPage: config.page_length, totalResult: objModel.no_of_records});
      obj.pages = paginator.render();
      res.render('./levels/index', obj);
    });
  }.bind(this));
  
});


module.exports = router;
