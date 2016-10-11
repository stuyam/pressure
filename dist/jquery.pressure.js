// Pressure v2.0.0 | Created By Stuart Yamartino | MIT License | 2015 - Present
;(function(window, document, $) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//--------------------- Public jQuery API Section ---------------------//

if ($ !== false) {

  $.fn.pressure = function (closure, options) {
    loopPressureElements(this, closure, options);
    return this;
  };

  $.pressureConfig = function (options) {
    Config.set(options);
  }, $.pressureMap = function (x, in_min, in_max, out_min, out_max) {
    return map(x, in_min, in_max, out_min, out_max);
  };
} else {
  throw new Error("Pressure jQuery requires jQuery is loaded before your jquery.pressure.min.js file");
}

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
      var _this = this;

      // if on desktop and requesting Force Touch or not requesting 3D Touch
      if (isDesktop && (this.type === 'desktop' || this.type !== 'mobile')) {
        new AdapterForceTouch(this);
      }
      // if on mobile and requesting 3D Touch or not requestion Force Touch
      else if (isMobile && (this.type === 'mobile' || this.type !== 'desktop')) {
          new Adapter3DTouch(this);
        }
        // unsupported if it is requesting a type and your browser is of other type
        else {
            this.element.addEventListener(isMobile ? 'touchstart' : 'mousedown', function (event) {
              return new BaseAdapter(_this).runClosure('unsupported', event);
            }, false);
          }
    }
  }]);

  return Element;
}();

var BaseAdapter = function () {
  function BaseAdapter(element) {
    _classCallCheck(this, BaseAdapter);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.pressed = false;
    this.deepPressed = false;
    this.supported = false;
    this.preventSelect();
  }

  _createClass(BaseAdapter, [{
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
    key: "setSupport",
    value: function setSupport(boolean) {
      this.supported = boolean;
    }
  }, {
    key: "failOrPolyfill",
    value: function failOrPolyfill(event) {
      // is the polyfill option set
      if (Config.get('polyfill', this.element.options)) {
        // if the polyfill is not set, set it
        if (this.polyfill instanceof AdapterPolyfill === false) {
          this.polyfill = new AdapterPolyfill(this.element);
        }
        this.polyfill.runEvent(event);
      } else {
        this.runClosure('unsupported', event);
      }
    }

    // run the closure if the property exists in the object

  }, {
    key: "runClosure",
    value: function runClosure(method) {
      if (this.block.hasOwnProperty(method)) {
        // call the closure method and apply nth arguments if they exist
        this.block[method].apply(this.el || this, Array.prototype.slice.call(arguments, 1));
      }
    }

    // prevent the default action of text selection, "peak & pop", and force touch special feature

  }, {
    key: "preventSelect",
    value: function preventSelect() {
      if (Config.get('preventSelect', this.element.options)) {
        this.el.style.webkitTouchCallout = "none";
        this.el.style.webkitUserSelect = "none";
        this.el.style.khtmlUserSelect = "none";
        this.el.style.MozUserSelect = "none";
        this.el.style.msUserSelect = "none";
        this.el.style.userSelect = "none";
      }
    }
  }]);

  return BaseAdapter;
}();

/*
This adapter is for Macs with Force Touch trackpads.
*/

var AdapterForceTouch = function (_BaseAdapter) {
  _inherits(AdapterForceTouch, _BaseAdapter);

  function AdapterForceTouch(element) {
    _classCallCheck(this, AdapterForceTouch);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(AdapterForceTouch).call(this, element));

    _this2.start();
    _this2.change();
    _this2.startDeepPress();
    _this2.endDeepPress();
    _this2.end();
    return _this2;
  }

  // Support check methods


  _createClass(AdapterForceTouch, [{
    key: "start",
    value: function start() {
      this.add('webkitmouseforcewillbegin', this.startForce.bind(this));
      this.add('mousedown', this.support.bind(this));
    }
  }, {
    key: "startForce",
    value: function startForce(event) {
      this.setSupport(true);
      this.setPressed(true);
      this.runClosure('start', event);
    }
  }, {
    key: "support",
    value: function support(event) {
      if (this.pressed === false) {
        this.setSupport(false);
        this.failOrPolyfill(event);
      }
    }
  }, {
    key: "change",
    value: function change() {
      var _this3 = this;

      this.add('webkitmouseforcechanged', function (event) {
        if (_this3.pressed && event.webkitForce > 0) {
          _this3.runClosure('change', _this3.normalizeForce(event.webkitForce), event);
        }
      });
    }
  }, {
    key: "startDeepPress",
    value: function startDeepPress() {
      var _this4 = this;

      this.add('webkitmouseforcedown', function (event) {
        if (_this4.pressed) {
          _this4.setDeepPressed(true);
          _this4.runClosure('startDeepPress', event);
        }
      });
    }
  }, {
    key: "endDeepPress",
    value: function endDeepPress() {
      var _this5 = this;

      this.add('webkitmouseforceup', function () {
        if (_this5.pressed && _this5.deepPressed) {
          _this5.runClosure('endDeepPress');
        }
        _this5.setDeepPressed(false);
      });
      this.add('mouseleave', function () {
        if (_this5.pressed && _this5.deepPressed) {
          _this5.runClosure('endDeepPress');
        }
        _this5.setDeepPressed(false);
      });
    }
  }, {
    key: "end",
    value: function end() {
      var _this6 = this;

      // call 'end' when the mouse goes up or leaves the element
      this.add('mouseup', function () {
        if (_this6.pressed) {
          _this6.runClosure('end');
        }
        _this6.setPressed(false);
      });

      this.add('mouseleave', function () {
        if (_this6.pressed) {
          _this6.runClosure('end');
        }
        _this6.setPressed(false);
      });
    }

    // make the force the standard 0 to 1 scale and not the 1 to 3 scale

  }, {
    key: "normalizeForce",
    value: function normalizeForce(force) {
      return this.reachOne(map(force, 1, 3, 0, 1));
    }

    // if the force value is above 0.999 set the force to 1

  }, {
    key: "reachOne",
    value: function reachOne(force) {
      return force > 0.999 ? 1 : force;
    }
  }]);

  return AdapterForceTouch;
}(BaseAdapter);

/*
This adapter is more iOS devices running iOS 10 or higher and support 3D touch.
*/

var Adapter3DTouch = function (_BaseAdapter2) {
  _inherits(Adapter3DTouch, _BaseAdapter2);

  function Adapter3DTouch(element) {
    _classCallCheck(this, Adapter3DTouch);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Adapter3DTouch).call(this, element));

    if (supportsTouchForceChange) {
      _this7.start();
    } else {
      _this7.start_legacy();
    }
    _this7.end();
    return _this7;
  }

  // Support check methods


  _createClass(Adapter3DTouch, [{
    key: "start",
    value: function start() {
      var _this8 = this;

      this.add('touchforcechange', function (event) {
        _this8.setPressed(true);
        _this8.runClosure('change', _this8.selectTouch(event).force, event);
      });
      this.add('touchstart', this.support.bind(this, 0));
    }
  }, {
    key: "support",
    value: function support(iter, event) {
      if (this.pressed === false && iter > 10) {
        this.failOrPolyfill(event);
      } else if (this.pressed === false) {
        setTimeout(this.support.bind(this), 10, iter++, event);
      } else {
        this.runClosure('start', event);
      }
    }
  }, {
    key: "start_legacy",
    value: function start_legacy() {
      var _this9 = this;

      this.add('touchstart', function (event) {
        _this9.forceValueTest = event.touches[0].force;
        _this9.support_legacy(0, event);
      });
    }
  }, {
    key: "support_legacy",
    value: function support_legacy(iter, event) {
      // this checks up to 10 times on a touch to see if the touch can read a force value
      // if the force value has changed it means the device supports pressure
      // more info from this issue https://github.com/yamartino/pressure/issues/15
      if (event.touches[0].force !== this.forceValueTest) {
        this.started(event);
      } else if (iter <= 10) {
        setTimeout(this.support_legacy.bind(this), 10, iter++, event);
      } else {
        this.failOrPolyfill(event);
      }
    }
  }, {
    key: "started",
    value: function started(event) {
      this.setPressed(true);
      this.runClosure('start', event);
      this.runForce(event);
    }
  }, {
    key: "runForce",
    value: function runForce(event) {
      if (this.pressed) {
        this.setPressed(true);
        this.touch = this.selectTouch(event);
        setTimeout(this.runForce.bind(this), 10, event);
        this.runClosure('change', this.touch.force, event);
      }
    }
  }, {
    key: "end",
    value: function end() {
      var _this10 = this;

      // call 'end' when the touch goes up
      this.add('touchend', function () {
        if (_this10.pressed) {
          _this10.endDeepPress();
          _this10.setPressed(false);
          _this10.runClosure('end');
        }
      });
    }
  }, {
    key: "startDeepPress",
    value: function startDeepPress(event) {
      if (this.deepPressed === false) {
        this.runClosure('startDeepPress', event);
      }
      this.setDeepPressed(true);
    }
  }, {
    key: "endDeepPress",
    value: function endDeepPress() {
      if (this.deepPressed === true) {
        this.runClosure('endDeepPress');
      }
      this.setDeepPressed(false);
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

  return Adapter3DTouch;
}(BaseAdapter);

var AdapterPolyfill = function (_BaseAdapter3) {
  _inherits(AdapterPolyfill, _BaseAdapter3);

  function AdapterPolyfill(element) {
    _classCallCheck(this, AdapterPolyfill);

    // this.$start();
    // this.$change();

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(AdapterPolyfill).call(this, element));

    _this11.end();
    _this11.force = 0;
    _this11.increment = 10 / Config.get('polyfillSpeed', _this11.element.options);
    // this.firstRun(firstEvent);
    return _this11;
  }

  _createClass(AdapterPolyfill, [{
    key: "runEvent",
    value: function runEvent(event) {
      this.start(event);
      this.change(event);
    }

    // $start(){
    //   // call 'start' when the touch goes down
    //   this.add(isMobile ? 'touchstart' : 'mousedown', (event) => {
    //     this.startLogic(event);
    //   });
    // }

  }, {
    key: "start",
    value: function start(event) {
      console.warn(this.supported, 1);
      if (this.supported === false) {
        this.setPressed(true);
        this.runClosure('start', event);
      }
    }

    // $change(){
    //   this.add(isMobile ? 'touchstart' : 'mousedown', this.changeLogic.bind(this));
    // }

  }, {
    key: "change",
    value: function change(event) {
      console.warn(this.supported, 2);
      if (this.pressed && this.supported === false) {
        this.setPressed(true);
        this.runForce(event);
      }
    }
  }, {
    key: "end",
    value: function end() {
      // call 'end' when the mouse goes up or leaves the element
      if (isMobile) {
        this.add('touchend', this.endEvent.bind(this));
      } else {
        this.add('mouseup', this.endEvent.bind(this));
        this.add('mouseleave', this.endEvent.bind(this));
      }
    }
  }, {
    key: "endEvent",
    value: function endEvent() {
      if (this.supported === false) {
        this.endDeepPress();
        this.setPressed(false);
        this.runClosure('end');
        this.force = 0;
      }
    }
  }, {
    key: "startDeepPress",
    value: function startDeepPress(event) {
      if (this.deepPressed === false) {
        this.runClosure('startDeepPress', event);
      }
      this.setDeepPressed(true);
    }
  }, {
    key: "endDeepPress",
    value: function endDeepPress() {
      if (this.deepPressed === true) {
        this.runClosure('endDeepPress');
      }
      this.setDeepPressed(false);
    }
  }, {
    key: "runForce",
    value: function runForce(event) {
      if (this.pressed) {
        this.runClosure('change', this.force, event);
        this.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
        this.force = this.force + this.increment > 1 ? 1 : this.force + this.increment;
        setTimeout(this.runForce.bind(this), 10, event);
      }
    }
  }]);

  return AdapterPolyfill;
}(BaseAdapter);

// This class holds the states of the the Pressure config


var Config = {

  // 'true' prevents the selecting of text and images via css properties
  preventSelect: true,

  // 'mobile' or 'desktop' will make it run only on that type of device
  only: null,

  // 'true' will make polyfill run when pressure is not supported
  polyfill: false,

  // milliseconds it takes to go from 0 to 1 for the polyfill
  polyfillSpeed: 1000,

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

// the map method allows for interpolating a value from one range of values to another
// example from the Arduino documentation: https://www.arduino.cc/en/Reference/Map
var map = function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

// check if device is desktop device
var isDesktop = 'ontouchstart' in document === false;

// check if device is regular mobile device
var isMobile = 'ontouchstart' in document === true;

// check if device is an Apple iOS 10+ device
var supportsTouchForceChange = 'ontouchforcechange' in document;
}(typeof window !== "undefined" ? window : false, typeof window !== "undefined" ? window.document : false, typeof jQuery !== "undefined" ? jQuery : false));
