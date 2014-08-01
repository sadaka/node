var express = require('express');

var Levels = function(con){
  this.db = con;
  this.no_of_records = 0;
};

Levels.prototype.findAll = function(callback){
  // it fetches all the records from Levels table
  var limit = '';
  if(this.limit_start)
    limit = ' limit '+ this.limit_start;
  else
    limit = ' limit 0';
    
  if(this.limit_end)
    limit += ', '+ this.limit_end;
    
  var q = 'select SQL_CALC_FOUND_ROWS i.* from levels i where i.status = 1' + limit;
  this.db.query(q, process.domain.intercept(function(data) {
  
      //~ process.nextTick(process.domain.intercept(function() {
        //~ throw new Error("The individual request will be passed to the express error handler, and your application will keep running.");
      //~ }));
    //~ if( error ){ 
      //~ callback(error);
    //~ }else{ 
      callback(null, data);
    //~ }
  }.bind(this)));
};

Levels.prototype.list = function(callback){
  // it fetches all the records from levels table
  var q = 'select l.name, l.id, l.level from levels l where l.status = 1';
  var me = this;
  this.db.query(q, process.domain.intercept(function(data) {
    callback(null, data);
  }.bind(this)));
};

Levels.prototype.parentsList = function(callback){
  // it fetches all the records from levels table
  var q = 'select l.name, l.id, l.level from levels l where l.status = 1 and type="parent"';
  var me = this;
  this.db.query(q, process.domain.intercept(function(data) {
    callback(null, data);
  }.bind(this)));
};

Levels.prototype.getRecordsCount = function(callback){
  this.db.query('select FOUND_ROWS() as total_count', function(error, data){
    if( error ){ 
      callback(error);
    }else{ 
      this.no_of_records = data[0].total_count;
      callback(null, data);
      //~ console.log(this.no_of_records);
    }
  }.bind(this));
}

Levels.prototype.findById = function(id, callback){
  var q = 'select * from levels where id = '+id;
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};

Levels.prototype.deleteById = function(id, callback){
  var q = 'update levels set status=0 where id = '+this.db.escape(id);
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};


Levels.prototype.save = function(data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      subq += (subq == '')?'doc = NOW()':', doc=UNIX_TIMESTAMP()';
      myCon.query('insert into levels set  '+subq, function(error, data) {
        if( error ) 
          callback(error);
        else 
          callback(null, data);
      });
    //~ }else{
      //~ callback({code:'Email already exists!'});
    //~ }
  //~ })  
};

Levels.prototype.update = function(id, data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false || emailExists == id){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('update levels set  '+subq +' where id = '+myCon.escape(id), function(error, data) {
        if( error ) 
          callback(error);
        else 
          callback(null, data);
      });
    //~ }else{
      //~ callback({code:'Email already exists!'});
    //~ }
  //~ })  
};


module.exports = Levels;
