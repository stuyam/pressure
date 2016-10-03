// Pressure v1.0.1 | Created By Stuart Yamartino | MIT License | 2015-Present
;(function(window, document) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//--------------------- Public API Section ---------------------//
// this is the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force or 3D Touch

  set: function set(selector, closure, options) {
    loopPressureElements(selector, closure, options);
  },


  // set configuration options for global config
  config: function config(options) {
    Config.set(options);
  },


  // the map method allows for interpolating a value from one range of values to another
  // example from the Arduino documentation: https://www.arduino.cc/en/Reference/Map
  map: function map(x, in_min, in_max, out_min, out_max) {
    return _map(x, in_min, in_max, out_min, out_max);
  }
};

// Assign the Pressure object to the global object (or module for npm) so it can be called from inside the self executing anonymous function
if (window !== false) {
  // if Pressure is not defined, it is the jquery.pressure library and skip the next setup
  if (typeof Pressure !== "undefined") {
    // this if block came from: http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
    if (typeof define === "function" && define.amd) {
      // Now we're wrapping the factory and assigning the return
      // value to the root (window) and returning it as well to
      // the AMD loader.
      var pressure = Pressure;
      define(["pressure"], function (Pressure) {
        return Pressure;
      });
    } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
      // I've not encountered a need for this yet, since I haven't
      // run into a scenario where plain modules depend on CommonJS
      // *and* I happen to be loading in a CJS browser environment
      // but I'm including it for the sake of being thorough
      var pressure = Pressure;
      module.exports = pressure;
    } else {
      window.Pressure = Pressure;
    }
  }
} else {
  console.warn("Pressure requires a window with a document");
  // I can't put 'return' here because babel blows up when it is compiled with gulp
  // because it is not in a function. It is only put into the iife when gulp runs.
  // The next line is replaced with 'return;' when gulp runs.
  return;
}

var Element = function () {
  function Element(element, block, options) {
    _classCallCheck(this, Element);

    this.element = element;
    this.block = block;
    this.type = Config.get('only', options);
    this.options = options;
    this.routeEvents();
  }

  _createClass(Element, [{
    key: "routeEvents",
    value: function routeEvents() {
      // if on desktop and requesting Force Touch or not requesting 3D Touch
      if (isDesktop && (this.type === 'desktop' || this.type !== 'mobile')) {
        new AdapterForceTouch(this);
      }
      // if on mobile and requesting 3D Touch or not requestion Force Touch
      else if (isMobile && supports3DTouch && (this.type === 'mobile' || this.type !== 'desktop')) {
          new Adapter3DTouch(this);
        }
        // if on mobile and requesting 3D Touch or not requestion Force Touch
        else if (isMobile && (this.type === 'mobile' || this.type !== 'desktop')) {
            new AdapterMobile(this);
          }
          // if it is requesting a type and your browser is of other type
          else {
              this.instantFail();
            }
    }
  }, {
    key: "instantFail",
    value: function instantFail() {
      var _this = this;

      this.element.addEventListener(isMobile ? 'touchstart' : 'mousedown', function () {
        return runClosure(_this.block, 'unsupported', _this.element);
      }, false);
    }
  }]);

  return Element;
}();

var Adapter = function () {
  function Adapter(element) {
    _classCallCheck(this, Adapter);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.pressed = false;
    this.deepPressed = false;
  }

  _createClass(Adapter, [{
    key: "add",
    value: function add(event, set) {
      this.el.addEventListener(event, set, false);
    }
  }, {
    key: "remove",
    value: function remove(event, set) {
      this.el.removeEventListener(event, set);
    }
  }, {
    key: "setPressed",
    value: function setPressed(boolean) {
      this.pressed = boolean;
    }
  }, {
    key: "setDeepPressed",
    value: function setDeepPressed(boolean) {
      this.deepPressed = boolean;
    }
  }, {
    key: "failOrPolyfill",
    value: function failOrPolyfill(event) {
      // is the polyfill option set
      if (Config.get('polyfill', this.element.options) === true) {
        this.polyfill = new AdapterPolyfill(this.element, event);
      } else {
        runClosure(this.block, 'unsupported', this.el);
      }
    }

    // prevent the default action of text selection, "peak & pop", and force touch special feature

  }, {
    key: "preventDefault",
    value: function preventDefault(event) {
      if (Config.get('preventDefault', this.element.options) === true) {
        event.preventDefault();
        this.el.style.webkitTouchCallout = "none";
        this.el.style.userSelect = "none";
        this.el.style.webkitUserSelect = "none";
        this.el.style.MozUserSelect = "none";
      }
    }
  }]);

  return Adapter;
}();

/*
This adapter is for Macs with Force Touch trackpads.
*/

var AdapterForceTouch = function (_Adapter) {
  _inherits(AdapterForceTouch, _Adapter);

  function AdapterForceTouch(element) {
    _classCallCheck(this, AdapterForceTouch);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(AdapterForceTouch).call(this, element));

    _this2.$start();
    _this2.$change();
    _this2.$startDeepPress();
    _this2.$endDeepPress();
    _this2.$end();
    return _this2;
  }

  // Support check methods


  _createClass(AdapterForceTouch, [{
    key: "$start",
    value: function $start() {
      this.add('webkitmouseforcewillbegin', this.startForce.bind(this));
      this.add('mousedown', this.support.bind(this));
    }
  }, {
    key: "startForce",
    value: function startForce(event) {
      this.setPressed(true);
      this.preventDefault(event);
      runClosure(this.block, 'start', this.el, event);
    }
  }, {
    key: "support",
    value: function support(event) {
      if (this.pressed === false) {
        this.failOrPolyfill(event);
      }
    }
  }, {
    key: "$change",
    value: function $change() {
      var _this3 = this;

      this.add('webkitmouseforcechanged', function (event) {
        if (_this3.pressed && event.webkitForce !== 0) {
          runClosure(_this3.block, 'change', _this3.el, _this3.normalizeForce(event.webkitForce), event);
        }
      });
    }
  }, {
    key: "$startDeepPress",
    value: function $startDeepPress() {
      var _this4 = this;

      this.add('webkitmouseforcedown', function (event) {
        if (_this4.pressed) {
          _this4.setDeepPressed(true);
          runClosure(_this4.block, 'startDeepPress', _this4.el, event);
        }
      });
    }
  }, {
    key: "$endDeepPress",
    value: function $endDeepPress() {
      var _this5 = this;

      this.add('webkitmouseforceup', function () {
        if (_this5.pressed && _this5.deepPressed) {
          _this5.setDeepPressed(false);
          runClosure(_this5.block, 'endDeepPress', _this5.el);
        }
      });
      this.add('mouseleave', function () {
        if (_this5.pressed && _this5.deepPressed) {
          _this5.setDeepPressed(false);
          runClosure(_this5.block, 'endDeepPress', _this5.el);
        }
      });
    }
  }, {
    key: "$end",
    value: function $end() {
      var _this6 = this;

      // call 'end' when the mouse goes up or leaves the element
      this.add('mouseup', function () {
        if (_this6.pressed) {
          _this6.setPressed(false);
          runClosure(_this6.block, 'end', _this6.el);
        }
      });
      this.add('mouseleave', function () {
        if (_this6.pressed) {
          _this6.setPressed(false);
          runClosure(_this6.block, 'end', _this6.el);
        }
      });
    }

    // make the force the standard 0 to 1 scale and not the 1 to 3 scale

  }, {
    key: "normalizeForce",
    value: function normalizeForce(force) {
      return this.reachOne(_map(force, 1, 3, 0, 1));
    }

    // if the force value is above 0.999 set the force to 1

  }, {
    key: "reachOne",
    value: function reachOne(force) {
      return force > 0.999 ? 1 : force;
    }
  }]);

  return AdapterForceTouch;
}(Adapter);

/*
This adapter is more iOS devices running iOS 10 or higher and support 3D touch.
*/

var Adapter3DTouch = function (_Adapter2) {
  _inherits(Adapter3DTouch, _Adapter2);

  function Adapter3DTouch(element) {
    _classCallCheck(this, Adapter3DTouch);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Adapter3DTouch).call(this, element));

    _this7.$support();
    _this7.$start();
    _this7.$change();
    _this7.$startDeepPress();
    _this7.$endDeepPress();
    _this7.$end();
    return _this7;
  }

  // Support check methods


  _createClass(Adapter3DTouch, [{
    key: "$support",
    value: function $support() {
      this.add('touchforcechange', this.enabled);
      this.add('touchstart', this.supportCallback.bind(this));
    }
  }, {
    key: "enabled",
    value: function enabled(event) {
      event.preventDefault();
      Support.didSucceed('force');
    }
  }, {
    key: "supportCallback",
    value: function supportCallback(event) {
      if (Support.forPressure === true || this.polyfill instanceof AdapterPolyfill) {
        this.remove('touchforcechange', this.enabled);
        this.preventDefault(event);
      } else {
        this.failOrPolyfill(event);
      }
    }
  }, {
    key: "$start",
    value: function $start() {
      var _this8 = this;

      // call 'start' when the mouse goes down
      this.add('touchstart', function (event) {
        if (Support.forPressure) {
          _this8.setPressed(true);
          runClosure(_this8.block, 'start', _this8.el, event);
        }
      });
    }
  }, {
    key: "$change",
    value: function $change() {
      var _this9 = this;

      this.add('touchforcechange', function (event) {
        if (Support.forPressure && event.webkitForce !== 0 && _this9.pressed) {
          runClosure(_this9.block, 'change', _this9.el, _this9.normalizeForce(event.webkitForce), event);
        }
      });
    }
  }, {
    key: "$end",
    value: function $end() {
      var _this10 = this;

      // call 'end' when the mouse goes up or leaves the element
      this.add('touchend', function () {
        if (Support.forPressure) {
          _this10.setPressed(false);
          runClosure(_this10.block, 'end', _this10.el);
        }
      });
      // this.add('mouseleave', () => {
      //   if(Support.forPressure){
      //     if(this.pressed){
      //       runClosure(this.block, 'end', this.el);
      //     }
      //     this.setPressed(false);
      //   }
      // });
    }

    // $startDeepPress(){
    //   this.add('webkitmouseforcedown', (event) => {
    //     if(Support.forPressure){
    //       this.setDeepPressed(true);
    //       runClosure(this.block, 'startDeepPress', this.el, event);
    //     }
    //   });
    // }

    // $endDeepPress(){
    //   this.add('webkitmouseforceup', () => {
    //     if(Support.forPressure){
    //       this.setDeepPressed(false);
    //       runClosure(this.block, 'endDeepPress', this.el);
    //     }
    //   });
    //   this.add('mouseleave', () => {
    //     if(Support.forPressure){
    //       if(this.deepPressed){
    //         runClosure(this.block, 'endDeepPress', this.el);
    //       }
    //       this.setDeepPressed(false);
    //     }
    //   });
    // }

    // // make the force the standard 0 to 1 scale and not the 1 to 3 scale
    // normalizeForce(force){
    //   return this.reachOne(map(force, 1, 3, 0, 1));
    // }

    // // if the force value is above 0.999 set the force to 1
    // reachOne(force){
    //   return force > 0.999 ? 1 : force;
    // }

  }]);

  return Adapter3DTouch;
}(Adapter);

/*
This adapter is more iOS devices running iOS 9 or lower and support 3D Touch
This also conforms to the W3C spec fo any future devices will support force
sensitive screans.
*/

var AdapterMobile = function (_Adapter3) {
  _inherits(AdapterMobile, _Adapter3);

  function AdapterMobile(element) {
    _classCallCheck(this, AdapterMobile);

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(AdapterMobile).call(this, element));

    _this11.$support();
    _this11.$start();
    _this11.$change();
    _this11.$end();
    return _this11;
  }

  _createClass(AdapterMobile, [{
    key: "$support",
    value: function $support() {
      this.supportMethod = this.middleMan.bind(this);
      this.add('touchstart', this.supportMethod);
    }
  }, {
    key: "middleMan",
    value: function middleMan(event) {
      this.setPressed(true);
      this.forceValueTest = event.touches[0].force;
      this.supportCallback(0, event);
    }
  }, {
    key: "supportCallback",
    value: function supportCallback(iter, event) {
      // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
      if (Support.hasRun === false && !(this.polyfill instanceof AdapterPolyfill)) {
        // if the force value has changed it means the device supports pressure
        // more info from this issue https://github.com/yamartino/pressure/issues/15
        if (event.touches[0].force !== this.forceValueTest) {
          this.preventDefault(event);
          Support.didSucceed('3d');
          this.remove('touchstart', this.supportMethod);
          runClosure(this.block, 'start', this.el, event);
          this.changeLogic(event);
        } else if (iter <= 10 && this.pressed) {
          iter += 1;
          setTimeout(this.supportCallback.bind(this), 10, iter, event);
        } else if (this.pressed) {
          this.failOrPolyfill(event);
        }
      } else if (Support.forPressure || this.polyfill instanceof AdapterPolyfill) {
        this.remove('touchstart', this.supportMethod);
      } else {
        this.failOrPolyfill(event);
      }
    }
  }, {
    key: "$start",
    value: function $start() {
      var _this12 = this;

      // call 'start' when the touch goes down
      this.add('touchstart', function (event) {
        if (Support.forPressure) {
          _this12.setPressed(true);
          _this12.preventDefault(event);
          runClosure(_this12.block, 'start', _this12.el, event);
        }
      });
    }
  }, {
    key: "$change",
    value: function $change() {
      this.add('touchstart', this.changeLogic.bind(this));
    }
  }, {
    key: "changeLogic",
    value: function changeLogic(event) {
      if (Support.forPressure && this.pressed) {
        this.setPressed(true);
        this.runForce(event);
      }
    }
  }, {
    key: "$end",
    value: function $end() {
      var _this13 = this;

      // call 'end' when the touch goes up
      this.add('touchend', function () {
        if (Support.forPressure) {
          _this13.endDeepPress();
          _this13.setPressed(false);
          runClosure(_this13.block, 'end', _this13.el);
        }
      });
    }
  }, {
    key: "startDeepPress",
    value: function startDeepPress(event) {
      if (this.deepPressed === false) {
        runClosure(this.block, 'startDeepPress', this.el, event);
      }
      this.setDeepPressed(true);
    }
  }, {
    key: "endDeepPress",
    value: function endDeepPress() {
      if (this.deepPressed === true) {
        runClosure(this.block, 'endDeepPress', this.el);
      }
      this.setDeepPressed(false);
    }
  }, {
    key: "runForce",
    value: function runForce(event) {
      if (this.pressed) {
        this.touch = this.selectTouch(event);
        setTimeout(this.runForce.bind(this), 10, event);
        runClosure(this.block, 'change', this.el, this.touch.force, event);
      }
    }

    // link up the touch point to the correct element, this is to support multitouch

  }, {
    key: "selectTouch",
    value: function selectTouch(event) {
      if (event.touches.length === 1) {
        return this.returnTouch(event.touches[0], event);
      } else {
        for (var i = 0; i < event.touches.length; i++) {
          // if the target press is on this element
          if (event.touches[i].target === this.el) {
            return this.returnTouch(event.touches[i], event);
          }
        }
      }
    }

    // return the touch and run a start or end for deep press

  }, {
    key: "returnTouch",
    value: function returnTouch(touch, event) {
      touch.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
      return touch;
    }
  }]);

  return AdapterMobile;
}(Adapter);

var AdapterPolyfill = function (_Adapter4) {
  _inherits(AdapterPolyfill, _Adapter4);

  function AdapterPolyfill(element, firstEvent) {
    _classCallCheck(this, AdapterPolyfill);

    var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(AdapterPolyfill).call(this, element));

    _this14.$start();
    _this14.$change();
    _this14.$end();
    _this14.force = 0;
    _this14.increment = 0.01;
    _this14.firstRun(firstEvent);
    return _this14;
  }

  _createClass(AdapterPolyfill, [{
    key: "firstRun",
    value: function firstRun(event) {
      this.preventDefault(event);
      this.startLogic(event);
      this.changeLogic(event);
    }
  }, {
    key: "$start",
    value: function $start() {
      var _this15 = this;

      // call 'start' when the touch goes down
      this.add(isMobile ? 'touchstart' : 'mousedown', function (event) {
        _this15.startLogic(event);
      });
    }
  }, {
    key: "startLogic",
    value: function startLogic(event) {
      this.setPressed(true);
      runClosure(this.block, 'start', this.el, event);
    }
  }, {
    key: "$change",
    value: function $change() {
      this.add(isMobile ? 'touchstart' : 'mousedown', this.changeLogic.bind(this));
    }
  }, {
    key: "changeLogic",
    value: function changeLogic(event) {
      if (this.pressed) {
        this.setPressed(true);
        this.runForce(event);
      }
    }
  }, {
    key: "$end",
    value: function $end() {
      var _this16 = this;

      // call 'end' when the mouse goes up or leaves the element
      this.add(isMobile ? 'touchend' : 'mouseup', function () {
        _this16.endDeepPress();
        _this16.setPressed(false);
        runClosure(_this16.block, 'end', _this16.el);
        _this16.force = 0;
      });
      this.add('mouseleave', function () {
        _this16.endDeepPress();
        if (_this16.pressed) {
          runClosure(_this16.block, 'end', _this16.el);
        }
        _this16.setPressed(false);
        _this16.force = 0;
      });
    }
  }, {
    key: "startDeepPress",
    value: function startDeepPress(event) {
      if (this.deepPressed === false) {
        runClosure(this.block, 'startDeepPress', this.el, event);
      }
      this.setDeepPressed(true);
    }
  }, {
    key: "endDeepPress",
    value: function endDeepPress() {
      if (this.deepPressed === true) {
        runClosure(this.block, 'endDeepPress', this.el);
      }
      this.setDeepPressed(false);
    }
  }, {
    key: "runForce",
    value: function runForce(event) {
      if (this.pressed) {
        runClosure(this.block, 'change', this.el, this.force, event);
        this.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
        this.force = this.force + this.increment > 1 ? 1 : this.force + this.increment;
        setTimeout(this.runForce.bind(this), 10, event);
      }
    }
  }]);

  return AdapterPolyfill;
}(Adapter);

// This class holds the states of the the Pressure config


var Config = {

  preventDefault: true,

  only: null,

  polyfill: false,

  // this will get the correct config / option settings for the current pressure check
  get: function get(option, options) {
    return options.hasOwnProperty(option) ? options[option] : this[option];
  },


  // this will set the global configs
  set: function set(options) {
    for (var k in options) {
      if (options.hasOwnProperty(k) && this.hasOwnProperty(k) && k != 'get' && k != 'set') {
        this[k] = options[k];
      }
    }
  }
};

// // This class holds the states of the the Pressure support the user has
// var Support = {

//   // if the support has already been checked
//   hasRun: false,

//   // if the device has support for pressure or not
//   forPressure: false,

//   // the type of support the device has "force" or "3d"
//   type: false,

//   // Check if the device is mobile or desktop
//   mobile: 'ontouchstart' in document,

//   // Check if running iOS 10
//   legacyMobile: 'ontouchforcechange' in document,

//   didFail(){
//     this.hasRun = true;
//     this.forPressure = false;
//   },

//   didSucceed(type){
//     this.hasRun = true;
//     this.forPressure = true;
//     this.type = type;
//   }
// }

//------------------- Helpers -------------------//

// accepts jQuery object, node list, string selector, then called a setup for each element
var loopPressureElements = function loopPressureElements(selector, closure) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // if a string is passed in as an element
  if (typeof selector === 'string' || selector instanceof String) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
      new Element(elements[i], closure, options);
    }
    // if a single element object is passed in
  } else if (isElement(selector)) {
      new Element(selector, closure, options);
      // if a node list is passed in ex. jQuery $() object
    } else {
        for (var i = 0; i < selector.length; i++) {
          new Element(selector[i], closure, options);
        }
      }
};

//Returns true if it is a DOM element
var isElement = function isElement(o) {
  return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? o instanceof HTMLElement : //DOM2
  o && (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
};

// run the closure if the property exists in the object
var runClosure = function runClosure(closure, method, element) {
  if (closure.hasOwnProperty(method)) {
    // call the closure method and apply nth arguments if they exist
    closure[method].apply(element || this, Array.prototype.slice.call(arguments, 3));
  }
};

// the map method allows for interpolating a value from one range of values to another
// example from the Arduino documentation: https://www.arduino.cc/en/Reference/Map
var _map = function _map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

// check if device is desktop device
var isDesktop = 'ontouchstart' in document === false;

// check if device is regular mobile device
var isMobile = 'ontouchstart' in document === true;

// check if device is an Apple iOS 10+ device
var supports3DTouch = 'ontouchforcechange' in document;
}(typeof window !== "undefined" ? window : false, typeof window !== "undefined" ? window.document : false));
