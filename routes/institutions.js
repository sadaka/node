var express = require('express');
var router = express.Router();
var path = require('path');

var mi = require('../models/institutions');
var helpers = require('../utility/helper');
var config = require('../config/config');
var pagination = require('pagination');


router.get('/add', helpers.requiredLogin, function(req, res, next){
  mInst = new mi(__myCon);
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.type = data.type;
    res.locals.parent_id = data.parent_id;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }
  
  mInst.list(function(err, data){
    if(err){
    }else{
      res.locals.ps = data;
      res.locals.types = mInst.getTypes();
      res.render('./institutions/add');  
    }
  });
});

router.post('/add', helpers.requiredLogin, function(req, res, next){
  mInst = new mi(__myCon);
  var usersData = {name:req.body.name, type:req.body.type, parent_id:req.body.parent_id, address:req.body.address};
  mInst.save(usersData, function(err, data){
    if(err){
      req.session.tmp = usersData;
      req.session.__err = err.code;
      res.redirect('/institutions/add');
    }else{
      req.session.__msg = 'Institute added successfully!';
      res.redirect('/institutions');
    }
  });
});

router.get('/del/:id', helpers.requiredLogin, function(req, res, next){
  mInst = new mi(__myCon);  
  mInst.deleteById(req.params.id, function(err, data){
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
  mInst = new mi(__myCon);  
  if(req.session.tmp){
    var data = req.session.tmp;
    res.locals.name = data.name;
    res.locals.parent_id = data.parent_id;
    res.locals.type = data.type;
    res.locals.address = data.address;
    req.session.destroy(function(err){});
  }else{
  
    mInst.findById(req.params.id, function(err, data){
      if(err){
        req.session.__err = err.code;
        res.redirect('/institutions');
      }else{
        mInst.list(function(err, data1){
          if(err){
          }else{
            res.locals.ps = data1;
            res.locals.types = mInst.getTypes();
            res.render('./institutions/edit', {type:data[0].type, name:data[0].name, address:data[0].address, id:data[0].id, parent_id:data[0]['parent_id']});
          }
        });
      }
    });
  }
});

router.post('/edit/:id', helpers.requiredLogin, function(req, res, next){
  mInst = new mi(__myCon);
  var instData = {name:req.body.name, type:req.body.type, parent_id:req.body.parent_id, address:req.body.address};
  mInst.update(req.params.id, instData, function(err, data){
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
  mInst = new mi(__myCon);
  var page = req.query.page || 1;
  
  mInst.limit_start = (page - 1) * config.page_length;
  mInst.limit_end = mInst.limit_start + config.page_length;
  mInst.no_of_records = 0;
  mInst.findAll(function(err, rows){
    var obj = {};
    if(err){
      obj.err = 'Error in getting institute records.';
    }else{
      obj.msg = res.__msg;
      obj.institutions = rows;
      console.log(rows);
      obj.start = mInst.limit_start;
    }    
    mInst.getRecordsCount(function(err, data){    
      var paginator = new pagination.SearchPaginator({prelink:'/institutions/', current: page, rowsPerPage: config.page_length, totalResult: mInst.no_of_records});
      obj.pages = paginator.render();
      res.render('./institutions/index', obj);
    });
  }.bind(this));
  
});


module.exports = router;
