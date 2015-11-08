var Browser = {

  checkSupport: function(closure, type){
    if( (this.browserForceSupported() || this.browser3DSupported()) && !Support.hasRun){
      this.testDeviceSupport(closure, type);
    } else if(!Support.hasRun) {
      // XXX: this doesn't actually check this information right
      Support.browserFail();
      // if force may be supported but 3D is NOT
      if(this.browserForceSupported() && type === '3d'){
        runClosure(closure, 'failInstant', failureObject(type + '-maybe'));
      }
      // if 3D may be supported but force is NOT
      else if(this.browser3DSupported() && type === 'force'){
        runClosure(closure, 'failInstant', failureObject(type + '-maybe'));
      }
      // there is no support for either 3D or Force touch
      else{
        runClosure(closure, 'failInstant', failureObject());
      }
    }
  },

  browserForceSupported: function(){
    return 'onwebkitmouseforcewillbegin' in document;
  },

  browser3DSupported: function(){
    return 'ontouchstart' in document;
  },

  testDeviceSupport: function(closure, type){
    Support.forPressure = false;
    this.returnSupportBind = this.returnSupport.bind(this, closure, type);

    this.addMouseEvents();
    this.addTouchEvents();
  },

  addTouchEvents: function(){
    // check for Force Touch
    document.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
    document.addEventListener('mousedown', this.returnSupportBind, false);
  },

  addMouseEvents: function(){
    // check for 3D Touch
    document.addEventListener('touchstart', this.touch3DEnabled, false);
    document.addEventListener('touchstart', this.returnSupportBind, false);
  },

  removeDocumentListeners: function(){
    // remove all the event listeners after the initial test
    document.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
    document.removeEventListener('mousedown', this.returnSupportBind);
    document.removeEventListener('touchstart', this.touch3DEnabled);
    document.removeEventListener('touchstart', this.returnSupportBind);
  },

  touchForceEnabled: function(){
    Support.didSucceed('force');
  },

  touch3DEnabled: function(event){
    if(event.touches[0].force !== undefined){
      Support.didSucceed('3d');
    }
  },

  returnSupport: function(closure, type){
    this.removeDocumentListeners();
    // device supports force touch but user is checking for 3d support
    if(Support.type === 'force' && type === '3d'){
      runClosure(closure, 'failLater', failureObject(type));
    }
    // device supports 3d touch but user is checking for force support
    else if(Support.type === '3d' && type === 'force'){
      runClosure(closure, 'failLater', failureObject(type));
    }
    // device has support
    else if(Support.forPressure){
      runClosure(closure, 'success');
    }
    // fail
    else{
      Support.deviceFail();
      runClosure(closure, 'failLater', failureObject());
    }
  }
}
