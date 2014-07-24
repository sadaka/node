var validate = {
  regex:{
    email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    varchar:/^[a-zA-Z\s]+$/,
    general:/^[0-9a-zA-Z\s_\-'\.\&\!\@]+$/,
    charInt:/^[\w]+$/,
    numeric:/^\d+\.\d+$/,
    integer:/^\d+$/,
    youtubeUrl:/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
    url:/^((https?|ftp):\/\/|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].*)?$/i
  },
  register:function(formId, rules, conf){
    this.rules = rules;
    this.formId = formId;
    this.conf = conf;
    this.error_class = (conf && conf.error_class)? conf.error_class :'error';
    $('#'+formId).submit(this.init.bind(this));
  },
  init:function(e){
    var rules = this.rules;
    $('span.'+this.error_class).remove();
    var error = false;
    
    $($('#'+this.formId)).find('input,select,textarea').filter(':input').each(function(i, el){
      var elName = $(el).attr('name');
      if(rules[elName]){
        var val = $(el).val().trim();
        
        if($.type(rules[elName]) == 'object'){
          for(j in rules[elName]){
            if(!this.validate(j, el, val))
              error = true;
          }
        }else{
          if(!this.validate(rules[elName], el, val))
            error = true;
        }        
      }
    }.bind(this));
    if(error){
      e.preventDefault();      
      return false;
    }
    return;
  },
  validate:function(validation, el, val){
    var elName = $(el).attr('name');
    var rules = this.rules;
    if(rules.messages[elName]){
      if($.type(rules[elName]) == 'object')
        var m = rules.messages[elName][validation];
      else
        var m = rules.messages[elName];
    }
    var error = false;
    var msg = false;
    switch (validation){
      case 'required':
        if(val == ''){
          msg = m|| elName + ' is required.' ;
          error = true;
        }
      break;
      case 'email':
        if(!val.match(this.regex.email)){
          msg = m || 'Please enter valid email.' ;
          error = true;
        }
      break;
      case 'integer':
        if(!val.match(this.regex.integer)){
          msg = m || 'Please enter integer value.' ;
          error = true;
        }
      break;
      case 'numeric':
        if(!val.match(this.regex.numeric)){
          msg = m || 'Please enter numeric value.' ;
          error = true;
        }
      break;
      case 'char':
      case 'varchar':
        if(!val.match(this.regex.varchar)){
          msg = m || 'Please enter valid value.' ;
        }
      break;
      case 'general':
      default:
        if(!val.match(this.regex.general)){
          msg = m || 'Please enter valid '+elName+'.' ;
          error = true;
        }
      break;
    }
    if(error){
      $("<span class='"+this.error_class+"'>"+msg+"</span>").insertAfter($(el));
      return false;
    }
    return true;
  }
};
