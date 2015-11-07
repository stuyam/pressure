var Browser = {

  checkSupport: function(closure){
    if(Support.hasRun){
      callClosure(closure);
    }
    else if(this.browserSupported()){
      this.testDeviceSupport(closure);
    } else {
      Support.browserFail();
      callClosure(closure);
    }
  },

  browserSupported: function(){
    return ('onwebkitmouseforcewillbegin' in document) || ('ontouchstart' in document);
  },

  testDeviceSupport: function(closure){
    Support.forPressure = false;
    this.returnSupportBind = this.returnSupport.bind(this, closure);

    // check for Force Touch
    document.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
    document.addEventListener('mousedown', this.returnSupportBind, false);

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
    console.log(event);

    if(event.touches[0].force !== undefined){
      Support.didSucceed('3d');
    }
  },

  returnSupport: function(closure){
    this.removeDocumentListeners();
    if(Support.forPressure){
      callClosure(closure, 'success');
    } else {
      Support.deviceFail();
      callClosure(closure, 'fail');
    }
  }
}
