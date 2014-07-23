var validate = function (formId, rules){
  var regex = {
    email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    varchar:/^[a-zA-Z\s]+$/,
    general:/^[0-9a-zA-Z\s_\-'\.\&\!\@]+$/,
    charInt:/^[\w]+$/,
    numeric:/^\d+\.\d+$/,
    integer:/^\d+$/,
    youtubeUrl:/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
    url:/^((https?|ftp):\/\/|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].*)?$/i
  };
  
  $('#'+formId).submit(function(e){
    tt();
    $('span.error').remove();
    var error = false;
    $('#'+formId +' input,select,textarea').filter(':input').each(function(){
      if(rules[$(this).attr('name')]){
        var val = $(this).val().trim();
        if($.type(rules[$(this).attr('name')]) == 'object'){
          for(j in rules[$(this).attr('name')]){
            switch (j){
              case 'required':
                if(val == ''){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')][j] || $(this).attr('name') + ' is required.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
              case 'email':
                if(!val.match(regex.email)){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')][j] || 'Please enter valid email.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
              case 'integer':
                if(!val.match(regex.integer)){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')] || 'Please enter integer value.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
              case 'numeric':
                if(!val.match(regex.numeric)){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')] || 'Please enter numeric value.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
              case 'char':
              case 'varchar':
                if(!val.match(regex.varchar)){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')] || 'Please enter valid value.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
              case 'general':
              default:
                if(!val.match(regex.general)){
                  error = true;
                  var msg = rules.messages[$(this).attr('name')] || 'Please enter valid '+$(this).attr('name')+'.' ;
                  $("<span class='error'>"+msg+"</span>").insertAfter($(this));
                }
              break;
            }
          }
        }else{
          switch (rules[$(this).attr('name')]){
            case 'required':
              if(val == ''){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || $(this).attr('name') + ' is required.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
            case 'email':
              if(!val.match(regex.email)){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || 'Please enter valid email.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
            case 'integer':
              if(!val.match(regex.integer)){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || 'Please enter integer value.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
            case 'numeric':
              if(!val.match(regex.numeric)){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || 'Please enter numeric value.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
            case 'char':
            case 'varchar':
              if(!val.match(regex.varchar)){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || 'Please enter valid value.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
            case 'general':
            default:
              if(!val.match(regex.general)){
                error = true;
                var msg = rules.messages[$(this).attr('name')] || 'Please enter valid '+$(this).attr('name')+'.' ;
                $("<span class='error'>"+msg+"</span>").insertAfter($(this));
              }
            break;
          }
        }
        
      }
    });
    if(error)
      e.preventDefault();
    return true;
  });
  return;
}



validate.prototype.validateYoutubeUrl = function (url){
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    // return (url.match(p)) ? RegExp.$1 : false;
    return (url.match(p)) ? true : false;
}

validate.prototype.validateUrl = function (url){
    var reg = /^((https?|ftp):\/\/|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].*)?$/i;    
    return url.match(reg)?true:false;
}
