// Pressure v0.0.1 alpha | Created By Stuart Yamartino | MIT License | 2015 
;(function(window, document) {
//--------------------- Public API Section ---------------------//
// this is the start of the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch
  set: function(selector, closure){
    Router.set(selector, closure);
  },

  // targets ONLY devices with Force Touch
  setForceTouch: function(selector, closure){
    Router.set(selector, closure, 'force');
  },

  // targets ONLY devices with 3D touch
  set3DTouch: function(selector, closure){
    Router.set(selector, closure, '3d');
  },

  // this method is to determine if the browser and/or user have support for force touch of 3D touch
  // when this method is run, it will immediatly return if the browser does not support the force/3D touch,
  // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
  support: function(closure){
    Browser.checkSupport(closure);
  },

  supportForceTouch: function(closure){
    Browser.checkSupport(closure, 'force');
  },

  support3DTouch: function(closure){
    Browser.checkSupport(closure, '3d');
  },

}

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

var Event = {

  // this method builds events and handles event support on ever public method called by user
  build: function(selector, userClosure, closure){

    // if the user has pressure support
    if(Support.forPressure){
      closure();
    }
    // if the user doesn't have pressure support, run failure closure if it exists
    else if(Support.hasRun){
      getFailClosure(userClosure)(failureObject());
    }
    // the user has not been tested for support yet, test their support and build closure
    else {
      Browser.checkSupport({
        success: function(){
          closure();
        },
        fail: getFailClosure(userClosure)
      });
    }
  },

  // this handles the executing of the Force Touch change event
  changeForceTouch: function(selector, closure){
    // loop over each item that is returned
    forEach(queryElement(selector), function(index, element){
      element.addEventListener('webkitmouseforcechanged', function(event){
        getSuccessClosure(closure).call(element, event.webkitForce, event);
      }, false);

      // prevent the default force touch action for bound elements
      element.addEventListener('webkitmouseforcewillbegin', function(event){
        event.preventDefault();
      });

      if (closure.hasOwnProperty('forceEnd')){
        // call the forceEnd when the mouse goes up of leaves the element
        element.addEventListener('mouseup', function(){
          closure.forceEnd.call(element);
        });
        element.addEventListener('mouseleave', function(){
          closure.forceEnd.call(element);
        });
      }
    });
  },

  // this handles the executing of the 3D Touch change event
  change3DTouch: function(selector, closure){
    // loop over each item that is returned
    forEach(queryElement(selector), function(index, element){
      // create new Touch3D object
      var touch = new Touch3D();
      // add event for touch start
      element.addEventListener('touchstart', function(event){
        touch.startCheckingForce(event, closure, element);
      }, false);

      // // add event for touch move and set changeExecute
      // element.addEventListener('touchmove', function(event){
      //   // Touch3D.changeExecute = success;
      //   Touch3D.startCheckingForce(event, closure);
      // }, false);

      // add event touch end to stop the change from running
      element.addEventListener('touchend', function(event){
        touch.up();
      }, false);
    });
  },
}

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

// 3D Touch function constructor
function Touch3D(){
  this.touchDown = false;
}

// the user is touching
Touch3D.prototype.down = function(){
  this.touchDown = true;
}

// the user is NOT touching
Touch3D.prototype.up = function(){
  this.touchDown = false;
}

// initialize the checking of the force pressure
Touch3D.prototype.startCheckingForce = function(event, closure, element) {
  this.element = element;
  this.down();
  console.log(event);
  // set touch event
  this.touch = event.touches[0];
  if(this.touch){
    this.fetchForce(event, closure);
  }
}

// if this.touchDown is still set to true, setTimeout to call itself ver and over again
Touch3D.prototype.fetchForce = function(event, closure) {
  if(this.touchDown) {
    this.touch = event.touches[0];
    setTimeout(this.fetchForce.bind(this), 10, event, closure);
    closure.call(this.element, this.touch.force || 0, event);
  }
}

// This class holds the states of the the Pressure support the user has
var Support = {

  hasRun: false,

  forPressure: false,

  type: '',

  failureType: '',

  browserFail: function(){
    this.didFail('browser');
  },

  deviceFail: function(){
    this.didFail('device');
  },

  didFail: function(type){
    this.hasRun = true;
    this.forPressure = false;
    this.failureType = type;
  },

  didSucceed: function(type){
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
}

// var runClosure = function(closure, method){
//   if(closure.hasOwnProperty(method)){
//     closure[method]();
//   }
//   // if(isObject(closure)){
//   //   runObjectClosure(closure);
//   // } else {
//   //   if(Support.forPressure){
//   //     closure();
//   //   }
//   // }
// }

// // runs the proper closures for the user if the closure is an object
// var runObjectClosure = function(closure){
//   if(Support.forPressure && closure.hasOwnProperty('success')){
//     closure.success();
//   } else if(!Support.forPressure && closure.hasOwnProperty('fail')){
//     closure.fail(failureObject());
//   }
// }

var getSuccessClosure = function(closure){
  if(isObject(closure)){
    if(closure.hasOwnProperty('success')){
      return closure.success;
    }
  } else {
    return closure;
  }
}

var getFailClosure = function(closure){
  var fail = function(){}
  if(isObject(closure)){
    if(closure.hasOwnProperty('fail')){
      fail = closure.fail;
    }
  }
  return fail;
}

// Standardized error reporting
var failureObject = function(errorType){
  var type = errorType || Support.failureType;
  switch (type) {
    case 'browser':
      var message = 'Browser does not support Force Touch or 3D Touch.';
      break;
    case 'device':
      var message = 'Device does not support Force Touch or 3D Touch.';
      break;
    case '3d':
      var message = 'Browser does support Force Touch but not 3D Touch.';
      break;
    case 'force':
      var message = 'Browser does support 3D Touch but not Force Touch.';
      break;
    // XXX: these maybe's are exactly correct
    case '3d-maybe':
      var message = 'Browser may support Force Touch but not 3D Touch.';
      break;
    case 'force-maybe':
      var message = 'Browser may support 3D Touch but not Force Touch.';
      break;
  }
  return {
    'error' : {
      'type'    : type,
      'message' : message
    }
  }
}

//------------------- Helpers Section -------------------//

// run the closure if the property exists in the object
var runClosure = function(closure, method){
  if(closure.hasOwnProperty(method)){
    // call the closure method and apply nth arguments if they exist
    closure[method].apply(this, Array.prototype.slice.call(arguments, 2));
  }
}

// return all elements that match the query selector
var queryElement = function(selector){
  return document.querySelectorAll(selector);
}

// loops over each item quered and calls the closure
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
}

// Helper to check if input it an object
var isObject = function(input){
  return input !== null && typeof input === 'object'
}

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
}(window, document));
