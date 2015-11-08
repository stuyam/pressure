var Router = {

  // this method will return a force value from the user and will automatically determine if the user has Force or 3D Touch
  // it also accepts an optional type, this type is passed in by the following 2 methods to be explicit about which change event type they want
  set : function(selector, closure, type){
    Event.build(selector, closure, function(){
      // Call ONLY the Force Touch method and only if the user supports it
      if(Support.type === 'force' && type === 'force'){
        Event.changeForceTouch(selector, closure);
      }
      // Call ONLY the 3D Touch method and only if the user supports it
      else if(Support.type === '3d' && type === '3d'){
        Event.change3DTouch(selector, closure);
      }
      // Call Force Touch if the user supports it
      else if(Support.type === 'force' && type !== '3d'){
        Event.changeForceTouch(selector, closure);
      }
      // Call 3D Touch if the user supports it
      else if(Support.type === '3d' && type !== 'force'){
        Event.change3DTouch(selector, closure);
      }
    }.bind(this));
  },

  support : function(closure, type){
    if(type === 'force'){

    } else if(type === '3d'){

    } else {
      Browser.checkSupport(closure);
    }
  }

}
