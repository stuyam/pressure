// Pressure v0.0.1 alpha | Created By Stuart Yamartino | MIT License | 2015 
;(function(window, document) {
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//--------------------- Public API Section ---------------------//
// this is the start of the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch

  set: function set(selector, closure, css) {
    Router.set(selector, closure, null, css);
  },

  // targets ONLY devices with Force Touch
  setForceTouch: function setForceTouch(selector, closure, css) {
    Router.set(selector, closure, 'force', css);
  },

  // targets ONLY devices with 3D touch
  set3DTouch: function set3DTouch(selector, closure, css) {
    Router.set(selector, closure, '3d', css);
  }
};

var Router = {

  // this method will return a force value from the user and will automatically determine if the user has Force or 3D Touch
  // it also accepts an optional type, this type is passed in by the following 2 methods to be explicit about which change event type they want

  set: function set(selector, closure, type) {
    var css = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    forEachElement(selector, function (index, element) {
      if (css) {
        element.webkitUserSelect = "none";
        // element.cursor = "pointer";
      }
      var el = new Element(element, closure, type);
      el.routeEvents();
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
      var touch3D = new Touch3D(this);
      touch3D.bindEvents();
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
        this.element.addEventListener('touchstart', function () {
          return runClosure(_this.block, 'unsupported');
        }, false);
      } else {
        this.element.addEventListener('mousedown', function () {
          return runClosure(_this.block, 'unsupported');
        }, false);
      }
    }
  }, {
    key: 'touchForceEnabled',
    value: function touchForceEnabled(event) {
      event.preventDefault();
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
  }]);

  return Element;
})();

var Touch3D = (function () {
  function Touch3D(element) {
    _classCallCheck(this, Touch3D);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
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
      var _this2 = this;

      if (this.block.hasOwnProperty('start')) {
        // call 'start' when the touch goes down
        this.el.addEventListener('touchstart', function () {
          if (Support.forPressure) {
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
        this.el.addEventListener('touchstart', function (event) {
          if (Support.forPressure) {
            _this3.setDown();
            // set touch event
            _this3.touch = _this3.selectTouch(event); //.touches[0];
            if (_this3.touch) {
              _this3.fetchForce(event);
            }
            // runClosure(this.block, 'change', this.el);
          }
        }, false);
      }
    }
  }, {
    key: 'end',
    value: function end() {
      var _this4 = this;

      if (this.block.hasOwnProperty('end')) {
        // call 'end' when the touch goes up
        this.el.addEventListener('touchend', function () {
          if (Support.forPressure) {
            _this4.setUp();
            runClosure(_this4.block, 'end', _this4.el);
          }
        }, false);
      }
    }
  }, {
    key: 'fetchForce',
    value: function fetchForce(event) {
      if (this.touchDown) {
        this.touch = this.selectTouch(event);
        setTimeout(this.fetchForce.bind(this), 10, event);
        runClosure(this.block, 'change', this.el, this.touch.force, event);
      }
    }
  }, {
    key: 'setDown',
    value: function setDown() {
      this.touchDown = true;
    }
  }, {
    key: 'setUp',
    value: function setUp() {
      this.touchDown = false;
    }

    // link up the touch point to the correct element, this is to support multitouch

  }, {
    key: 'selectTouch',
    value: function selectTouch(event) {
      for (var i = 0; i < event.touches.length; i++) {
        if (event.touches[i].target === this.el) {
          console.log(event.touches[i].force);
          return event.touches[i];
        }
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
      var _this5 = this;

      if (this.block.hasOwnProperty('start')) {
        // call 'start' when the mouse goes down
        this.el.addEventListener('mousedown', function () {
          if (Support.forPressure) {
            _this5.setDown();
            runClosure(_this5.block, 'start', _this5.el);
          }
        }, false);
      }
    }
  }, {
    key: 'change',
    value: function change() {
      var _this6 = this;

      if (this.block.hasOwnProperty('change')) {
        this.el.addEventListener('webkitmouseforcechanged', function (event) {
          if (Support.forPressure && event.webkitForce !== 0) {
            runClosure(_this6.block, 'change', _this6.el, _this6.normalizeForce(event.webkitForce), event);
          }
        }, false);
      }
    }
  }, {
    key: 'end',
    value: function end() {
      var _this7 = this;

      if (this.block.hasOwnProperty('end')) {
        // call 'end' when the mouse goes up or leaves the element
        this.el.addEventListener('mouseup', function () {
          if (Support.forPressure) {
            _this7.setUp();
            runClosure(_this7.block, 'end', _this7.el);
          }
        }, false);
        this.el.addEventListener('mouseleave', function () {
          if (Support.forPressure) {
            if (_this7.state === 'down') {
              runClosure(_this7.block, 'end', _this7.el);
            }
            _this7.setUp();
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

    // make the force the standard 0 to 1 scale and not the 1 to 3 scale

  }, {
    key: 'normalizeForce',
    value: function normalizeForce(force) {
      return (force - 1) / 2;
    }
  }]);

  return TouchForce;
})();

// This class holds the states of the the Pressure support the user has

var Support = {

  hasRun: false,

  forPressure: false,

  type: false,

  didFail: function didFail() {
    this.hasRun = true;
    this.forPressure = false;
  },
  didSucceed: function didSucceed(type) {
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
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

// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
}(window, document));
