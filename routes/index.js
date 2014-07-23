var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  try{
    if(req.session.loggedIn)
      res.render('index', { title: 'Welcome...', loggedIn:req.session.loggedIn});
    else
      res.render('./users/login', { title: 'Please login', loggedIn:false});
  }
  
  catch(e){
    throw new Error('Request can not be handled');
  }
  
});

module.exports = router;
