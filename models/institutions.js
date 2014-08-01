var express = require('express');

var Institutions = function(con){
  this.db = con;
  this.no_of_records = 0;
  this.mine = 'rakesh';
};

Institutions.prototype.findAll = function(callback){
  // it fetches all the records from Institutions table
  var limit = '';
  if(this.limit_start)
    limit = ' limit '+ this.limit_start;
  else
    limit = ' limit 0';
    
  if(this.limit_end)
    limit += ', '+ this.limit_end;
    
  var q = 'select SQL_CALC_FOUND_ROWS i.* from institutions i where i.status = 1' + limit;
  var me = this;
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

Institutions.prototype.list = function(callback){
  // it fetches all the records from Institutions table
  var q = 'select i.name, i.id, i.type from institutions i where i.status = 1';
  var me = this;
  this.db.query(q, process.domain.intercept(function(data) {
    callback(null, data);
  }.bind(this)));
};

Institutions.prototype.getRecordsCount = function(callback){
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

Institutions.prototype.getTypes = function(){
  return {university:'University', group:'Group', school:'School'}
}

Institutions.prototype.findById = function(id, callback){
  var q = 'select * from Institutions where id = '+id;
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};

Institutions.prototype.deleteById = function(id, callback){
  // we need to check here if this institute is not parent of any other institute
  this.isParent(id, function(err, isParent){
    if(err){
      callback(err);
    }else if(isParent){
      callback({code:'Institute can not be deleted. It is parent of other institutes!'});
    }else{
      var q = 'update Institutions set status=0 where id = '+this.db.escape(id);
      this.db.query(q, function(error, data) {
        if( error ) 
          callback(error);
        else 
          callback(null, data);
      });
    }
  }.bind(this));
};

Institutions.prototype.isParent = function(id, callback){
  this.db.query('select id from Institutions where parent_id = '+this.db.escape(id), function(error, data) {  
    if( error ) 
      callback(error);
    else 
      callback(null, (data.length > 0) ?true:false);
      
  });
};

Institutions.prototype.save = function(data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('insert into institutions set  '+subq, function(error, data) {
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

Institutions.prototype.update = function(id, data, callback){
  myCon = this.db;
  //~ this.emailExists(data['email'], function(error, emailExists){
    //~ if(emailExists == false || emailExists == id){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('update Institutions set  '+subq +' where id = '+myCon.escape(id), function(error, data) {
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


module.exports = Institutions;
