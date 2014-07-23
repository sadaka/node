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
  register:function(formId, rules){
    this.rules = rules;
    this.formId = formId;
    $('#'+formId).submit(this.init.bind(this));
  },
  init:function(e){
    var rules = this.rules;
    $('span.error').remove();
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
    
    switch (validation){
      case 'required':
        if(val == ''){
          var msg = m|| elName + ' is required.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
      case 'email':
        if(!val.match(this.regex.email)){
          var msg = m || 'Please enter valid email.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
      case 'integer':
        if(!val.match(this.regex.integer)){
          var msg = m || 'Please enter integer value.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
      case 'numeric':
        if(!val.match(this.regex.numeric)){
          var msg = m || 'Please enter numeric value.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
      case 'char':
      case 'varchar':
        if(!val.match(this.regex.varchar)){
          var msg = m || 'Please enter valid value.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
      case 'general':
      default:
        if(!val.match(this.regex.general)){
          var msg = m || 'Please enter valid '+elName+'.' ;
          $("<span class='error'>"+msg+"</span>").insertAfter($(el));
          return false;
        }
      break;
    }
    return true;
  }
};
