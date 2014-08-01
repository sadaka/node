var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//~ var ssn = require('session');
var session = require('express-session');
//~ var Session = ssn.Session('store');

var config = require('./config/config');
var routes = require('./routes/index');
var users = require('./routes/users');
var institutions = require('./routes/institutions');
var levels = require('./routes/levels');
var mysql = require('./config/mysql');


__myCon = mysql(config.db.host, config.db.user, config.db.password, config.db.database);

var app = express();
app.use(require('express-domain-middleware'));

app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s: %j', process.domain.id, req.method, req.url, err);
  res.send(500, "Something bad happened. :(");
  if(err.domain) {
    //you should think about gracefully stopping & respawning your server
    //since an unhandled error might put your application into an unknown state
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//~ var Manager = new ssn.Manager({'storage':{'type':'memory'},'expiration':200, 'secrete':'toSecrete'});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret:'topSekrete'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    if(req.session.__err){
        res.locals.error = req.session.__err;
        delete req.session.__err;
    }
    if(req.session.__msg){
        res.locals.message = req.session.__msg;
        delete req.session.__msg;
    }
    next();
});

app.use(function(req, res, next){
  var baseUrl = req.originalUrl.split('?')[0];
  if(baseUrl.slice(-1) == '/')
    baseUrl = baseUrl.slice(0, baseUrl.length -1);
    
  res.locals.baseUrl = path.normalize(baseUrl).replace('\\', '/');
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/institutions', institutions);
app.use('/levels', levels);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
