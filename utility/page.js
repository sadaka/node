//~ var express = require('express');

var page = function(current_page){
  this.page_length = 0;
  this.current_page = current_page || 1;
  this.total_records = 0;
};

page.prototype.current_page = function(){ return this.current_page;};
page.prototype.total_pages = function(){ 
  if(this.total_records == 0 || this.page_length == 0){
    return 0;
  }else{
    return ceil(this.total_records/this.page_length);
  }
};

module.exports = page;
