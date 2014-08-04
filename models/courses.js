var express = require('express');

var Courses = function(con){
  this.db = con;
  this.no_of_records = 0;
};

Courses.prototype.findAll = function(callback){
  // it fetches all the records from courses table
  var limit = '';
  if(this.limit_start)
    limit = ' limit '+ this.limit_start;
  else
    limit = ' limit 0';
    
  if(this.limit_end)
    limit += ', '+ this.limit_end;
    
  var q = 'select SQL_CALC_FOUND_ROWS i.*, l.name level_name, l.level from courses i left join levels l on (l.id = i.level_id) where i.status = 1' + limit;
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

Courses.prototype.list = function(callback){
  // it fetches all the records from courses table
  var q = 'select l.name, l.id, l.level_id from courses l where l.status = 1';
  var me = this;
  this.db.query(q, process.domain.intercept(function(data) {
    callback(null, data);
  }.bind(this)));
};

Courses.prototype.levelsList = function(callback){
  // it fetches all the records from courses table
  var q = 'select l.name, l.id, l.level from levels l where l.status = 1';
  var me = this;
  this.db.query(q, process.domain.intercept(function(data) {
    callback(null, data);
  }.bind(this)));
};

Courses.prototype.getRecordsCount = function(callback){
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

Courses.prototype.findById = function(id, callback){
  var q = 'select * from courses where id = '+id;
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};

Courses.prototype.deleteById = function(id, callback){
  var q = 'update courses set status=0 where id = '+this.db.escape(id);
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};


Courses.prototype.save = function(data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      subq += (subq == '')?'doc=UNIX_TIMESTAMP()':', doc=UNIX_TIMESTAMP()';
      myCon.query('insert into courses set  '+subq, function(error, data) {
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

Courses.prototype.update = function(id, data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false || emailExists == id){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('update courses set  '+subq +' where id = '+myCon.escape(id), function(error, data) {
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


module.exports = Courses;
