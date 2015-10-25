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
(function(){

  var Pressure = {

    //--------------------- Public API Section ---------------------//

    // This method is to determine if the browser and/or user have support for force touch of 3D touch
    // When this method is run, it will immediatly return if the browser does not support the force/3D touch,
    // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
    supported: function(closure){
      this.checkSupport(closure);
    },

    // This method will return a force value from the user and will automatically determine if the user has force or 3D touch
    change: function(element, closure){
      if(Support.forPressure){
        if(Support.type === 'force'){
          console.log('force');
          this.changeForceTouch(element, closure);
        } else if(this.type === '3d'){
          console.log('3d');
          this.change3DTouch(element, closure);
        }
      }
      // this.checkSupport({
      //   success: function(){
      //     if(Support.type === 'force'){
      //       console.log('force');
      //       this.changeForceTouch(element, closure);
      //     } else if(this.type === '3d'){
      //       console.log('3d');
      //       this.change3DTouch(element, closure);
      //     }
      //   },
      //   fail: failClosure(closure)
      // });
    },

    // This method is meant to be called when targeting ONLY devices with force touch
    changeForceTouch: function(element, success, failure){
      queryElement(element).addEventListener('webkitmouseforcechanged', function(event){
        success(event.webkitForce, event);
      }, false);
    },

    // This method is meant to be called when targeting ONLY devices with 3D touch
    change3DTouch: function(element, success, failure){
      var el = queryElement(element);
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


    // This method is an optinal method to pass a fail closure to and recieve errors on the failure
    // fail: function(failClosure){
    //   if(this.support.failure !== undefined){
    //     failClosure(this.support.failureObject(this.support.failure));
    //   }
    // },

    //--------------------- Start of "Private" classes / methods ---------------------//

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

    returnSupport: function(closure){
      this.removeDocumentListeners();
      if(Support.forPressure){
        callClosure(closure, 'success');
      } else {
        Support.deviceFail();
        callClosure(closure, 'fail');
      }
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
    },
  }

  var queryElement = function(element){
      return document.querySelector(element);
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
        closure[statusCheck](failureObject(Pressure.failure));
      } else {
        closure[statusCheck]();
      }
    }
  }

  // Standardized error reporting
  var failureObject = function(type){
    switch (type) {
      case 'browser':
        var message = 'browser does not support force touch';
        break;
      case 'device':
        var message = 'device does not support force touch';
        break;
    }
    return {
      'error' : {
        'type'    : type,
        'message' : message
      }
    }
  }

  var failClosure = function(closure){
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
})()



Pressure.supported({
  success:function(){
    Pressure.change('#element', function(force, event){
      console.log('TEST CHANGE');
      document.getElementById('element').style.width = Math.max((200 * force), 200) + 'px';
      document.getElementById('element').innerHTML = force;
      // console.log(force);
    });
    console.log('User and Browser both support force touch');
    console.log('supported!!!!');
  },
  fail: function(error){
    console.log('now!');
    console.log(error);
  }
});

// document.getElementById('element').addEventListener("webkitmouseforcechanged", forceChanged, false);
