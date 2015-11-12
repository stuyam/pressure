class Element{

  constructor(element, block, type){
    this.element = element;
    this.block = block;
    this.type = type;
  }

  routeEvents(){
    // if on desktop and requesting Force Touch
    if(Support.mobile === false && this.type === 'force'){
      this.addMouseEvents();
    }
    // if on mobile and requesting 3D Touch
    else if(Support.mobile === true && this.type === '3d'){
      this.addTouchEvents();
    }
    // if on desktop and NOT requesting 3D Touch
    else if(Support.mobile === false && this.type !== '3d'){
      this.addMouseEvents();
    }
    // if on mobile and NOT requesting Force Touch
    else if(Support.mobile === true && this.type !== 'force'){
      this.addTouchEvents();
    }
    // else make sure the fail events are setup
    else{
      this.failEvents();
    }
  }

  addMouseEvents(){
    // check for Force Touch
    this.element.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
    this.always();
    var touchForce = new TouchForce(this);
    touchForce.bindEvents();
  }

  addTouchEvents(){
    // check for 3D Touch
    this.element.addEventListener('touchstart', this.touch3DEnabled, false);
    this.always();
  }

  always(){
    if(Support.mobile){
      this.element.addEventListener('touchstart', this.dispatch.bind(this), false);
    } else {
      this.element.addEventListener('mousedown', this.dispatch.bind(this), false);
    }
  }

  failEvents(){
    if(Support.mobile){
      this.element.addEventListener('mousedown', () => runClosure(this.block, 'unsupported'), false);
    } else {
      this.element.addEventListener('touchstart', () => runClosure(this.block, 'unsupported'), false);
    }
  }

  touchForceEnabled(event){
    event.preventDefault()
    console.log('here1');
    Support.didSucceed('force');
  }

  touch3DEnabled(event){
    if(event.touches[0].force !== undefined){
      Support.didSucceed('3d');
    }
  }

  dispatch(){
    if(!Support.forPressure){
      Support.didFail();
      runClosure(this.block, 'unsupported', this.element);
    } else {
      this.element.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
      this.element.removeEventListener('touchstart', this.touch3DEnabled);
    }
  }





  //   testDeviceSupport(closure, type, element){
  //   this.returnSupportBind = this.returnSupport.bind(this, closure, type);

  //   this.addMouseEvents(element);
  //   this.addTouchEvents(element);
  // }

  // addTouchEvents(el){
  //   // check for Force Touch
  //   el.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
  //   el.addEventListener('mousedown', this.returnSupportBind, false);
  // }

  // addMouseEvents(el){
  //   // check for 3D Touch
  //   el.addEventListener('touchstart', this.touch3DEnabled, false);
  //   el.addEventListener('touchstart', this.returnSupportBind, false);
  // }

  // removeDocumentListeners(){
  //   // remove all the event listeners after the initial test
  //   document.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
  //   document.removeEventListener('mousedown', this.returnSupportBind);
  //   document.removeEventListener('touchstart', this.touch3DEnabled);
  //   document.removeEventListener('touchstart', this.returnSupportBind);
  // }

  // touchForceEnabled(){
  //   Support.didSucceed('force');
  // }

  // touch3DEnabled(event){
  //   if(event.touches[0].force !== undefined){
  //     Support.didSucceed('3d');
  //   }
  // }

  // returnSupport(closure, type){
  //   this.removeDocumentListeners();
  //   // if( Support.)
  //   // device supports force touch but user is checking for 3d support
  //   if(Support.type === 'force' && type === '3d'){
  //     runClosure(closure, 'failLater', failureObject(type));
  //   }
  //   // device supports 3d touch but user is checking for force support
  //   else if(Support.type === '3d' && type === 'force'){
  //     runClosure(closure, 'failLater', failureObject(type));
  //   }
  //   // device has support
  //   else if(Support.forPressure){
  //     runClosure(closure, 'success');
  //   }
  //   // fail
  //   else{
  //     Support.deviceFail();
  //     runClosure(closure, 'failLater', failureObject());
  //   }
  // }

  // // checkSupport: function(closure, type){
  // //   if( ! Support.hasRun){

  // //   }
  // //   // if(this.browserForceSupported() || this.browser3DSupported()){
  // //   //   this.testDeviceSupport(closure, type);
  // //   // } else {
  // //   //   // XXX: this doesn't actually check this information right
  // //   //   Support.browserFail();
  // //   //   // if force may be supported but 3D is NOT
  // //   //   if(this.browserForceSupported() && type === '3d'){
  // //   //     runClosure(closure, 'failInstant', failureObject(type + '-maybe'));
  // //   //   }
  // //   //   // if 3D may be supported but force is NOT
  // //   //   else if(this.browser3DSupported() && type === 'force'){
  // //   //     runClosure(closure, 'failInstant', failureObject(type + '-maybe'));
  // //   //   }
  // //   //   // there is no support for either 3D or Force touch
  // //   //   else{
  // //   //     runClosure(closure, 'failInstant', failureObject());
  // //   //   }
  // //   // }
  // // },

  // // browserForceSupported: function(){
  // //   return 'onwebkitmouseforcewillbegin' in document;
  // // },

  // // browser3DSupported: function(){
  // //   return 'ontouchstart' in document;
  // // },

  // buildEvent(selector, closure, type){
  //   forEachElement(selector, function(index, element){
  //     this.testDeviceSupport(closure, type, element);
  //   }).bind(this);
  // }

  // testDeviceSupport(closure, type, element){
  //   this.returnSupportBind = this.returnSupport.bind(this, closure, type);

  //   this.addMouseEvents(element);
  //   this.addTouchEvents(element);
  // }

  // addTouchEvents(el){
  //   // check for Force Touch
  //   el.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
  //   el.addEventListener('mousedown', this.returnSupportBind, false);
  // }

  // addMouseEvents(el){
  //   // check for 3D Touch
  //   el.addEventListener('touchstart', this.touch3DEnabled, false);
  //   el.addEventListener('touchstart', this.returnSupportBind, false);
  // }

  // removeDocumentListeners(){
  //   // remove all the event listeners after the initial test
  //   document.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
  //   document.removeEventListener('mousedown', this.returnSupportBind);
  //   document.removeEventListener('touchstart', this.touch3DEnabled);
  //   document.removeEventListener('touchstart', this.returnSupportBind);
  // }

  // touchForceEnabled(){
  //   Support.didSucceed('force');
  // }

  // touch3DEnabled(event){
  //   if(event.touches[0].force !== undefined){
  //     Support.didSucceed('3d');
  //   }
  // }

  // returnSupport(closure, type){
  //   this.removeDocumentListeners();
  //   // if( Support.)
  //   // device supports force touch but user is checking for 3d support
  //   if(Support.type === 'force' && type === '3d'){
  //     runClosure(closure, 'failLater', failureObject(type));
  //   }
  //   // device supports 3d touch but user is checking for force support
  //   else if(Support.type === '3d' && type === 'force'){
  //     runClosure(closure, 'failLater', failureObject(type));
  //   }
  //   // device has support
  //   else if(Support.forPressure){
  //     runClosure(closure, 'success');
  //   }
  //   // fail
  //   else{
  //     Support.deviceFail();
  //     runClosure(closure, 'failLater', failureObject());
  //   }
  // }

}
