var express = require('express');

var Users = function(con){
  this.db = con;
  this.no_of_records = 0;
  this.mine = 'rakesh';
};

Users.prototype.findAll = function(callback){
  // oh sorry! it's a conflict
  var limit = '';
  if(this.limit_start)
    limit = ' limit '+ this.limit_start;
  else
    limit = ' limit 0';
    
  if(this.limit_end)
    limit += ', '+ this.limit_end;
    
  var q = 'select SQL_CALC_FOUND_ROWS at.name access_type, u.id, u.name, u.email, u.address, u.password, u.status, u.dob, u.access_type_id from users u left join access_types at on (u.access_type_id = at.id) where u.status = 1' + limit;

  var me = this;
  this.db.query(q, function(error, data) {
    if( error ){ 
      callback(error);
    }else{ 
      callback(null, data);
    }
  }.bind(this));
};

Users.prototype.getRecordsCount = function(callback){
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


Users.prototype.findById = function(id, callback){
  var q = 'select * from users where id = '+id;
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};

Users.prototype.deleteById = function(id, callback){
  var q = 'update users set status=0 where id = '+this.db.escape(id);
  this.db.query(q, function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};

Users.prototype.emailExists = function(email, callback){
  this.db.query('select id from users where email = '+this.db.escape(email), function(error, data) {
  
    console.log(data.length);
    if( error ) 
      callback(error);
    else 
      callback(null, (data.length > 0) ?data[0].id:false);
      
  });
};

Users.prototype.save = function(data, callback){
  myCon = this.db;
  this.emailExists(data['email'], function(error, emailExists){
    if(emailExists == false){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('insert into users set  '+subq, function(error, data) {
        if( error ) 
          callback(error);
        else 
          callback(null, data);
      });
    }else{
      callback({code:'Email already exists!'});
    }
  })  
};

Users.prototype.update = function(id, data, callback){
  myCon = this.db;
  this.emailExists(data['email'], function(error, emailExists){
    if(emailExists == false || emailExists == id){
      var subq = '';
      for(i in data){
        subq += (subq =='')?i + '= '+ myCon.escape(data[i])+'':', ' +i +' = '+ myCon.escape(data[i])
      }
      myCon.query('update users set  '+subq +' where id = '+myCon.escape(id), function(error, data) {
        if( error ) 
          callback(error);
        else 
          callback(null, data);
      });
    }else{
      callback({code:'Email already exists!'});
    }
  })  
};

Users.prototype.validateUser = function(email, password, callback){
  this.db.query('select id, email, name, address from users where email = '+ this.db.escape(email) + ' and password = '+ this.db.escape(password) , function(error, data) {
    if( error ) 
      callback(error);
    else 
      callback(null, data);
  });
};



module.exports = Users;
