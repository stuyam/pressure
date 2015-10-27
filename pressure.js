// Created By Stuart Yamartino | MIT License | 2015


// wrap the entire library in a self executing anonymous function so as to not conflict
(function(window, document){

  //--------------------- Public API Section ---------------------//
  // this is the start of the Pressure Object, this is the only object that is accessible to the end user
  // only the methods in this object can be called, making it the "public api"
  var Pressure = {


    // this method is to determine if the browser and/or user have support for force touch of 3D touch
    // when this method is run, it will immediatly return if the browser does not support the force/3D touch,
    // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
    supported: function(closure){
      Browser.checkSupport(closure);
    },

    // targets any device with Force of 3D Touch
    change: function(selector, closure){
      Router.changePressure(selector, closure);
    },

    // targets ONLY devices with Force Touch
    changeForceTouch: function(selector, closure){
      Router.changePressure(selector, closure, 'force');
    },

    // targets ONLY devices with 3D touch
    change3DTouch: function(selector, closure){
      Router.changePressure(selector, closure, '3d');
    }
  }

  var Router = {

    // this method will return a force value from the user and will automatically determine if the user has Force or 3D Touch
    // it also accepts an optional type, this type is passed in by the following 2 methods to be explicit about which change event type they want
    changePressure : function(selector, closure, type){
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
      });
    },

    // this handles the executing of the 3D Touch change event
    change3DTouch: function(selector, closure){
      // loop over each item that is returned
      forEach(queryElement(selector), function(index, element){

        // add event for touch start and set changeExecute
        element.addEventListener('touchstart', function(event){
          // Touch3D.changeExecute = success;
          Touch3D.startCheckingForce(event, closure);
        }, false);

        // // add event for touch move and set changeExecute
        // element.addEventListener('touchmove', function(event){
        //   // Touch3D.changeExecute = success;
        //   Touch3D.startCheckingForce(event, closure);
        // }, false);

        // add event touch end to stop the change from running
        element.addEventListener('touchend', function(event){
          Touch3D.touchDown = false;
        }, false);
      });
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

    // initialize the checking of the force pressure
    startCheckingForce: function(event, closure) {
      this.touchDown = true;
      this.touch = event.touches[0];
      if(this.touch){
        this.fetchForce(closure);
      }
    },

    // if this.touchDown is still set to true, setTimeout to call itself ver and over again
    fetchForce: function(event, closure) {
      if(this.touchDown !== false) {
        setTimeout(this.fetchForce, 10, closure, event);
        closure(this.touch.force || 0, event);
      }
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

  //------------------- Helpers Section -------------------//

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

  // http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
  var hasOwnProperty = function(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
  }

  // Helper to check if input it an object
  var isObject = function(input){
    return input !== null && typeof input === 'object'
  }

  // Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
  window.Pressure = Pressure;
}(window, document));

