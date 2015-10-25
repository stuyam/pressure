// function prepareForForceClick(event)
// {
//   // Cancel the system's default behavior
//   event.preventDefault()
//   console.log('prepareForForceClick');
//   // Perform any other operations in preparation for a force click
// }

// function enterForceClick(event)
// {
//   log('enterForceClick');
//   // Perform operations in response to entering force click
// }

// function endForceClick(event)
// {
//   log('endForceClick');
//   // Perform operations in response to exiting force click
// }

// function forceChanged(e)
// {
//   console.log(e);
//   // log('forceChanged');
//   // Perform operations in response to changes in force
// }

// function setupForceClickBehavior(someElement)
// {
//   // Attach event listeners in preparation for responding to force clicks
//   someElement.addEventListener("webkitmouseforcewillbegin", prepareForForceClick, false);
//   someElement.addEventListener("webkitmouseforcedown", enterForceClick, false);
//   someElement.addEventListener("webkitmouseforceup", endForceClick, false);
  // someElement.addEventListener("webkitmouseforcechanged", forceChanged, false);
// }

// function log(logMe){
//   console.log(logMe);
// }

// function ready(fn) {
//   if (document.readyState != 'loading'){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }

// ready(function(){
//   var someElement = document.getElementById('element');
//   setupForceClickBehavior(someElement);
// });

// Wrap the entire library in a self executing anonymous function so as to no conflict
(function(window){

  //--------------------- Public API Section ---------------------//
  // This is the start of the Pressure Object, this is the only object that is accessible to the end user
  // Only the methods in this object can be called, making it the "public api"
  var Pressure = {


    // This method is to determine if the browser and/or user have support for force touch of 3D touch
    // When this method is run, it will immediatly return if the browser does not support the force/3D touch,
    // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
    supported: function(closure){
      Browser.checkSupport(closure);
    },

    // This method will return a force value from the user and will automatically determine if the user has force or 3D touch
    // It also accepts an optional type, this type is passed in by the next 2 methods to be explicit about which change event type they want
    change: function(selector, closure, type){
      Event.build(selector, closure, function(){

        // if type is set explicitly to 'force' and the user has 'force' support
        if(Support.type === 'force' && type === 'force'){
          Event.changeForceTouch(selector, closure);
        }
        // if type is set explicitly to '3d' and the user has '3d' support
        else if(Support.type === '3d' && type === '3d'){
          Event.change3DTouch(selector, closure);
        }
        // if the user has 'force' touch support
        else if(Support.type === 'force'){
          Event.changeForceTouch(selector, closure);
        }
        // if the user has '3d' touch support
        else if(Support.type === '3d'){
          Event.change3DTouch(selector, closure);
        }
      }.bind(this))
    },

    // This method is meant to be called when targeting ONLY devices with force touch
    changeForceTouch: function(selector, closure){
      this.change(selector, closure, 'force');
    },

    // This method is meant to be called when targeting ONLY devices with 3D touch
    change3DTouch: function(selector, closure){
      this.change(selector, closure, '3d');
    }
  }

  var Event = {

    // this method builds events and handles event support on ever public method called by user
    build: function(selector, userClosure, closure){
      if(Support.forPressure){
        closure();
      } else if(Support.hasRun){
        getFailClosure(userClosure)();
      } else {
        Browser.checkSupport({
          success: function(){
            closure();
          },
          fail: getFailClosure(userClosure)
        });
      }
    },

    changeForceTouch: function(selector, closure){
      queryElement(selector).addEventListener('webkitmouseforcechanged', function(event){
        getSuccessClosure(closure)(event.webkitForce, event);
      }, false);
    },

    // This method is meant to be called when targeting ONLY devices with 3D touch
    change3DTouch: function(selector, closure){
      var el = queryElement(selector);
      el.addEventListener('touchstart', function(event){
        Touch3D.changeExecute = success;
        Touch3D.startCheckingForce(event);
      }, false);
      el.addEventListener('touchmove', function(event){
        // this.touch3DchangeExecute = success;
        Touch3D.startCheckingForce(event);
      }, false);
      el.addEventListener('touchend', function(event){
        Touch3D.touchDown = false;
      }, false);
    },
  }


  var Browser = {

    checkSupport: function(closure){
      if(Support.hasRun){
        return Support.forPressure ? callClosure(closure, 'success') : callClosure(closure, 'fail');
      }
      if(this.browserSupported()){
        this.testDeviceSupport(closure);
      } else {
        Support.browserFail();
        callClosure(closure, 'fail');
      }
    },

    browserSupported: function(){
      return ('onwebkitmouseforcewillbegin' in document) || ('ontouchstart' in document);
    },

    testDeviceSupport: function(closure){
      Support.forPressure = false;
      this.returnSupportBind = this.returnSupport.bind(this, closure);
      document.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
      document.addEventListener('touchstart', this.touch3DEnabled, false);
      document.addEventListener('mousedown', this.returnSupportBind, false);
    },

    removeDocumentListeners: function(){
      document.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
      document.removeEventListener('touchstart', this.touch3DEnabled);
      document.removeEventListener('mousedown', this.returnSupportBind);
    },

    touchForceEnabled: function(){
      Support.type = 'force';
      Support.forPressure = true;
    },

    touch3DEnabled: function(event){
      if(event.touches[0].force !== undefined){
        Support.type = '3d';
        Support.forPressure = true;
      }
      this.returnSupport();
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
    }
  }

  // 3D Touch class force handlers
  var Touch3D = {
    startCheckingForce: function(event) {
      this.touchDown = true;
      this.touch = event.touches[0];
      if(this.touch){
        this.fetchForce();
      }
    },

    fetchForce: function() {
      if(this.touchDown !== false) {
        setTimeout(this.fetchForce, 10);
        return this.touch.force || 0;
      } else {
        return 0;
      }
    }
  }

  // if the user has jQuery installed, use that, else query the document
  var queryElement = function(selector){

    // if jQuery is not installed
    if(typeof jQuery === 'undefined'){
      return document.querySelector(selector);
    } else {
      return $(selector)[0];
    }
  }

  var callClosure = function(closure, status){
    if(isObject(closure)){
      runObjectClosure(closure, status, 'success');
      runObjectClosure(closure, status, 'fail');
    } else {
      if(status === 'success'){
        closure();
      }
    }
  }

  // http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
  var hasOwnProperty = function(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
  }

  // run the closure based on the returned status
  var runObjectClosure = function(closure, status, statusCheck){
    if(hasOwnProperty(closure, statusCheck) && status === statusCheck){
      if(status === 'fail'){
        closure[statusCheck](failureObject());
      } else {
        closure[statusCheck]();
      }
    }
  }

  // Standardized error reporting
  var failureObject = function(){
    switch (Support.failureType) {
      case 'browser':
        var message = 'Browser does not support Force Touch or 3D Touch.';
        break;
      case 'device':
        var message = 'Device does not support Force Touch or 3D Touch.';
        break;
    }
    return {
      'error' : {
        'type'    : Support.failureType,
        'message' : message
      }
    }
  }

  var getSuccessClosure = function(closure){
    if(isObject(closure)){
      if(hasOwnProperty(closure, 'success')){
        return closure.success;
      }
    } else {
      return closure;
    }
  }

  var getFailClosure = function(closure){
    var fail = function(){}
    if(isObject(closure)){
      if(hasOwnProperty(closure, 'fail')){
        fail = closure.fail;
      }
    }
    return fail;
  }

  // Helper to check if input it an object
  var isObject = function(input){
    return input !== null && typeof input === 'object'
  }

  // Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function: http://markdalgleish.com/2011/03/self-executing-anonymous-functions/
  window.Pressure = Pressure;
}(window))



// Pressure.supported({
//   success:function(){
    Pressure.change('#element', function(force, event){
      document.getElementById('element').style.width = Math.max((200 * force), 200) + 'px';
      document.getElementById('element').innerHTML = force;
    });
//     console.log('User and Browser both support force touch');
//   },
//   fail: function(error){
//     console.log(error);
//   }
// });

// document.getElementById('element').addEventListener("webkitmouseforcechanged", forceChanged, false);
