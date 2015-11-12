// Pressure v0.0.1 alpha | Created By Stuart Yamartino | MIT License | 2015 
;(function(window, document) {
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//--------------------- Public API Section ---------------------//
// this is the start of the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch
  set: function set(selector, closure) {
    Router.set(selector, closure);
  },

  // targets ONLY devices with Force Touch
  setForceTouch: function setForceTouch(selector, closure) {
    Router.set(selector, closure, 'force');
  },

  // targets ONLY devices with 3D touch
  set3DTouch: function set3DTouch(selector, closure) {
    Router.set(selector, closure, '3d');
  }

};

// this method is to determine if the browser and/or user have support for force touch of 3D touch
// when this method is run, it will immediatly return if the browser does not support the force/3D touch,
// however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
// support: function(closure){
//   Browser.checkSupport(closure);
// },

// supportForceTouch: function(closure){
//   Browser.checkSupport(closure, 'force');
// },

// support3DTouch: function(closure){
//   Browser.checkSupport(closure, '3d');
// },

var Router = {

  // this method will return a force value from the user and will automatically determine if the user has Force or 3D Touch
  // it also accepts an optional type, this type is passed in by the following 2 methods to be explicit about which change event type they want
  set: function set(selector, closure, type) {

    forEachElement(selector, function (index, element) {
      var el = new Element(element, closure, type);
      el.routeEvents();
      // this.testDeviceSupport(closure, type, element);
    });

    // Call ONLY the Force Touch method and only if the user supports it
    // if(type === 'force'){
    //   Browser.buildEvent(function(selector, closure, type){
    //     Event.changeForceTouch(selector, closure);
    //   });
    // }
    // // Call ONLY the 3D Touch method and only if the user supports it
    // else if(Support.type === '3d' && type === '3d'){
    //   Event.change3DTouch(selector, closure);
    // }
    // // Call Force Touch if the user supports it
    // else if(Support.type === 'force' && type !== '3d'){
    //   Event.changeForceTouch(selector, closure);
    // }
    // // Call 3D Touch if the user supports it
    // else if(Support.type === '3d' && type !== 'force'){
    //   Event.change3DTouch(selector, closure);
    // }
  }

};

var Event = {

  // // this method builds events and handles event support on ever public method called by user
  // build: function(selector, userClosure, closure){

  //   // if the user has pressure support
  //   if(Support.forPressure){
  //     closure();
  //   }
  //   // if the user doesn't have pressure support, run failure closure if it exists
  //   else if(Support.hasRun){
  //     getFailClosure(userClosure)(failureObject());
  //   }
  //   // the user has not been tested for support yet, test their support and build closure
  //   else {
  //     Browser.checkSupport({
  //       success: function(){
  //         closure();
  //       },
  //       fail: getFailClosure(userClosure)
  //     });
  //   }
  // },

  // this handles the executing of the Force Touch change event
  changeForceTouch: function changeForceTouch(selector, closure) {
    // loop over each item that is returned
    forEachElement(selector, function (index, element) {
      element.addEventListener('webkitmouseforcechanged', function (event) {
        getSuccessClosure(closure).call(element, event.webkitForce, event);
      }, false);

      // prevent the default force touch action for bound elements
      element.addEventListener('webkitmouseforcewillbegin', function (event) {
        event.preventDefault();
      });

      if (closure.hasOwnProperty('forceEnd')) {
        // call the forceEnd when the mouse goes up of leaves the element
        element.addEventListener('mouseup', function () {
          closure.forceEnd.call(element);
        });
        element.addEventListener('mouseleave', function () {
          closure.forceEnd.call(element);
        });
      }
    });
  },

  // this handles the executing of the 3D Touch change event
  change3DTouch: function change3DTouch(selector, closure) {
    // loop over each item that is returned
    forEachElement(selector, function (index, element) {
      // create new Touch3D object
      var touch = new Touch3D();
      // add event for touch start
      element.addEventListener('touchstart', function (event) {
        touch.startCheckingForce(event, closure, element);
      }, false);

      // // add event for touch move and set changeExecute
      // element.addEventListener('touchmove', function(event){
      //   // Touch3D.changeExecute = success;
      //   Touch3D.startCheckingForce(event, closure);
      // }, false);

      // add event touch end to stop the change from running
      element.addEventListener('touchend', function (event) {
        touch.up();
      }, false);
    });
  }
};

var Element = (function () {
  function Element(element, block, type) {
    _classCallCheck(this, Element);

    this.element = element;
    this.block = block;
    this.type = type;
  }

  _createClass(Element, [{
    key: 'routeEvents',
    value: function routeEvents() {
      // if on desktop and requesting Force Touch
      if (Support.mobile === false && this.type === 'force') {
        this.addMouseEvents();
      }
      // if on mobile and requesting 3D Touch
      else if (Support.mobile === true && this.type === '3d') {
          this.addTouchEvents();
        }
        // if on desktop and NOT requesting 3D Touch
        else if (Support.mobile === false && this.type !== '3d') {
            this.addMouseEvents();
          }
          // if on mobile and NOT requesting Force Touch
          else if (Support.mobile === true && this.type !== 'force') {
              this.addTouchEvents();
            }
            // else make sure the fail events are setup
            else {
                this.failEvents();
              }
    }
  }, {
    key: 'addMouseEvents',
    value: function addMouseEvents() {
      // check for Force Touch
      this.element.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
      this.always();
      var touchForce = new TouchForce(this);
      touchForce.bindEvents();
    }
  }, {
    key: 'addTouchEvents',
    value: function addTouchEvents() {
      // check for 3D Touch
      this.element.addEventListener('touchstart', this.touch3DEnabled, false);
      this.always();
    }
  }, {
    key: 'always',
    value: function always() {
      if (Support.mobile) {
        this.element.addEventListener('touchstart', this.dispatch.bind(this), false);
      } else {
        this.element.addEventListener('mousedown', this.dispatch.bind(this), false);
      }
    }
  }, {
    key: 'failEvents',
    value: function failEvents() {
      var _this = this;

      if (Support.mobile) {
        this.element.addEventListener('mousedown', function () {
          return runClosure(_this.block, 'unsupported');
        }, false);
      } else {
        this.element.addEventListener('touchstart', function () {
          return runClosure(_this.block, 'unsupported');
        }, false);
      }
    }
  }, {
    key: 'touchForceEnabled',
    value: function touchForceEnabled(event) {
      event.preventDefault();
      console.log('here1');
      Support.didSucceed('force');
    }
  }, {
    key: 'touch3DEnabled',
    value: function touch3DEnabled(event) {
      if (event.touches[0].force !== undefined) {
        Support.didSucceed('3d');
      }
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      if (!Support.forPressure) {
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

  }]);

  return Element;
})();

var Touch3D = (function () {
  function Touch3D(el) {
    _classCallCheck(this, Touch3D);

    this.el = el;
    this.touchDown = false;
  }

  _createClass(Touch3D, [{
    key: 'bindEvents',
    value: function bindEvents() {
      this.start();

      this.change();

      this.end();
    }
  }, {
    key: 'start',
    value: function start() {
      if (el.element.hasOwnProperty('start')) {
        // call 'start' when the touch goes down
        el.element.addEventListener('touchstart', function () {
          runClosure(el.element.block, 'start');
        }, false);
      }
    }
  }, {
    key: 'change',
    value: function change() {
      if (el.element.block.hasOwnProperty('change')) {
        el.element.addEventListener('touchstart', function (event) {
          this.down();
          // set touch event
          this.touch = event.touches[0];
          if (this.touch) {
            this.fetchForce(event);
          }
          runClosure(el.element.block, 'start');
        }, false);
      }
    }
  }, {
    key: 'end',
    value: function end() {
      if (el.element.hasOwnProperty('end')) {
        // call 'end' when the touch goes up
        el.element.addEventListener('touchend', function () {
          this.touchDown = false;
          runClosure(el.element.block, 'end');
        }, false);
      }
    }
  }, {
    key: 'fetchForce',
    value: function fetchForce(event) {
      if (this.touchDown) {
        this.touch = event.touches[0];
        setTimeout(this.fetchForce.bind(this), 10, event);
        runClosure(el.element.block, 'change', this.touch.force || 0, event);
      }
    }
  }]);

  return Touch3D;
})();

var TouchForce = (function () {
  function TouchForce(element) {
    _classCallCheck(this, TouchForce);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.state = 'up';
  }

  _createClass(TouchForce, [{
    key: 'bindEvents',
    value: function bindEvents() {
      this.start();

      this.change();

      this.end();

      this.preventDefaultForceTouch();
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      if (this.block.hasOwnProperty('start')) {
        // call 'start' when the mouse goes down
        this.el.addEventListener('mousedown', function () {
          if (Support.forPressure) {
            _this2.setDown();
            runClosure(_this2.block, 'start', _this2.el);
          }
        }, false);
      }
    }
  }, {
    key: 'change',
    value: function change() {
      var _this3 = this;

      if (this.block.hasOwnProperty('change')) {
        this.el.addEventListener('webkitmouseforcechanged', function (event) {
          if (Support.forPressure) {
            runClosure(_this3.block, 'change', _this3.el, event.webkitForce, event);
          }
        }, false);
      }
    }
  }, {
    key: 'end',
    value: function end() {
      var _this4 = this;

      if (this.block.hasOwnProperty('end')) {
        // call 'end' when the mouse goes up or leaves the element
        this.el.addEventListener('mouseup', function () {
          if (Support.forPressure) {
            _this4.setUp();
            runClosure(_this4.block, 'end', _this4.el);
          }
        }, false);
        this.el.addEventListener('mouseleave', function () {
          if (Support.forPressure) {
            if (_this4.state === 'down') {
              runClosure(_this4.block, 'end', _this4.el);
            }
            _this4.setUp();
          }
        }, false);
      }
    }
  }, {
    key: 'preventDefaultForceTouch',
    value: function preventDefaultForceTouch() {
      // prevent the default force touch action for bound elements
      this.el.addEventListener('webkitmouseforcewillbegin', function (event) {
        if (Support.forPressure) {
          event.preventDefault();
        }
      }, false);
    }
  }, {
    key: 'setUp',
    value: function setUp() {
      this.state = 'up';
    }
  }, {
    key: 'setDown',
    value: function setDown() {
      this.state = 'down';
    }
  }]);

  return TouchForce;
})();

// This class holds the states of the the Pressure support the user has

var Support = {

  hasRun: false,

  forPressure: false,

  type: false,

  // failureType: '',

  // mobile: '',

  // browserFail(){
  //   this.didFail('browser');
  // },

  // deviceFail(){
  //   this.didFail('device');
  // },

  didFail: function didFail() {
    this.hasRun = true;
    this.forPressure = false;
    // this.failureType = type;
  },
  didSucceed: function didSucceed(type) {
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
};

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

var getSuccessClosure = function getSuccessClosure(closure) {
  if (isObject(closure)) {
    if (closure.hasOwnProperty('success')) {
      return closure.success;
    }
  } else {
    return closure;
  }
};

var getFailClosure = function getFailClosure(closure) {
  var fail = function fail() {};
  if (isObject(closure)) {
    if (closure.hasOwnProperty('fail')) {
      fail = closure.fail;
    }
  }
  return fail;
};

// Standardized error reporting
var failureObject = function failureObject(errorType) {
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
    'error': {
      'type': type,
      'message': message
    }
  };
};

//------------------- Helpers Section -------------------//

// run the closure if the property exists in the object
var runClosure = function runClosure(closure, method, element) {
  if (closure.hasOwnProperty(method)) {
    // call the closure method and apply nth arguments if they exist
    closure[method].apply(element || this, Array.prototype.slice.call(arguments, 3));
  }
};

// return all elements that match the query selector
var queryElement = function queryElement(selector) {
  return document.querySelectorAll(selector);
};

// loops over each item quered and calls the closure
var forEachElement = function forEachElement(selector, callback, scope) {
  var array = queryElement(selector);
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

// Helper to check if input it an object
var isObject = function isObject(input) {
  return input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';
};

// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
}(window, document));
