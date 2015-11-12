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
    loopPressureElements(selector, closure, null, css);
  },

  // targets ONLY devices with Force Touch
  setForceTouch: function setForceTouch(selector, closure, css) {
    loopPressureElements(selector, closure, 'force', css);
  },

  // targets ONLY devices with 3D touch
  set3DTouch: function set3DTouch(selector, closure, css) {
    loopPressureElements(selector, closure, '3d', css);
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
      // if on desktop and requesting Force Touch or not requesting 3D Touch
      if (Support.mobile === false && (this.type === 'force' || this.type !== '3d')) {
        this.touchForceAdapter();
      }
      // if on mobile and requesting 3D Touch or not requestion Force Touch
      else if (Support.mobile === true && (this.type === '3d' || this.type !== 'force')) {
          this.touch3DAdapter();
        }
        // if it is requesting a type and your browser is of other type
        else {
            this.failEvents();
          }
    }
  }, {
    key: 'touchForceAdapter',
    value: function touchForceAdapter() {
      var adapter = new Adapter(new TouchForceAdapter(this));
      adapter.handle();
    }
  }, {
    key: 'touch3DAdapter',
    value: (function (_touch3DAdapter) {
      function touch3DAdapter() {
        return _touch3DAdapter.apply(this, arguments);
      }

      touch3DAdapter.toString = function () {
        return _touch3DAdapter.toString();
      };

      return touch3DAdapter;
    })(function () {
      var adapter = new Adapter(new touch3DAdapter(this));
      adapter.handle();
    })
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
  }]);

  return Element;
})();

var Adapter = (function () {
  function Adapter(adapter) {
    _classCallCheck(this, Adapter);

    this.adapter = adapter;
  }

  _createClass(Adapter, [{
    key: 'handle',
    value: function handle() {
      this.adapter.support();

      if (this.adapter.block.hasOwnProperty('start')) {
        this.adapter.start();
      }

      if (this.adapter.block.hasOwnProperty('change')) {
        this.adapter.change();
      }

      if (this.adapter.block.hasOwnProperty('end')) {
        this.adapter.end();
      }
    }
  }]);

  return Adapter;
})();

var Touch3DAdapter = (function () {
  function Touch3DAdapter(element) {
    _classCallCheck(this, Touch3DAdapter);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.touchDown = false;
  }

  _createClass(Touch3DAdapter, [{
    key: 'support',
    value: function support() {
      this.addListener('touchstart', this._dispatch.bind(this));
      this.el.addEventListener('touchstart', this._dispatch.bind(this), false);
    }
  }, {
    key: '_dispatch',
    value: function _dispatch(event) {
      if (event.touches[0].force !== undefined) {
        Support.didSucceed('3d');
        this.el.removeEventListener('touchstart', this._dispatch.bind(this));
      } else {
        Support.didFail();
        runClosure(this.block, 'unsupported', this.el);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      // call 'start' when the touch goes down
      this.el.addEventListener('touchstart', function () {
        if (Support.forPressure) {
          runClosure(_this2.block, 'start', _this2.el);
        }
      }, false);
    }
  }, {
    key: 'change',
    value: function change() {
      var _this3 = this;

      this.el.addEventListener('touchstart', function (event) {
        if (Support.forPressure) {
          _this3.setDown();
          // set touch event
          _this3.touch = _this3.selectTouch(event);
          if (_this3.touch) {
            _this3.fetchForce(event);
          }
        }
      }, false);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this4 = this;

      // call 'end' when the touch goes up
      this.el.addEventListener('touchend', function () {
        if (Support.forPressure) {
          _this4.setUp();
          runClosure(_this4.block, 'end', _this4.el);
        }
      }, false);
    }
  }, {
    key: '_fetchForce',
    value: function _fetchForce(event) {
      if (this.touchDown) {
        this.touch = this.selectTouch(event);
        setTimeout(this.fetchForce.bind(this), 10, event);
        runClosure(this.block, 'change', this.el, this.touch.force, event);
      }
    }
  }, {
    key: '_setDown',
    value: function _setDown() {
      this.touchDown = true;
    }
  }, {
    key: '_setUp',
    value: function _setUp() {
      this.touchDown = false;
    }

    // link up the touch point to the correct element, this is to support multitouch

  }, {
    key: '_selectTouch',
    value: function _selectTouch(event) {
      if (event.touches.length === 1) {
        return event.touches[0];
      }
      for (var i = 0; i < event.touches.length; i++) {
        if (event.touches[i].target === this.el) {
          console.log(event.touches[i].force);
          return event.touches[i];
        }
      }
    }
  }]);

  return Touch3DAdapter;
})();

var TouchForceAdapter = (function () {
  function TouchForceAdapter(element) {
    _classCallCheck(this, TouchForceAdapter);

    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.state = 'up';
    this._preventDefaultForceTouch();
  }

  // Support check methods

  _createClass(TouchForceAdapter, [{
    key: 'support',
    value: function support() {
      this.el.addEventListener('webkitmouseforcewillbegin', this._touchForceEnabled, false);
      this.el.addEventListener('mousedown', this._dispatch.bind(this), false);
    }
  }, {
    key: '_touchForceEnabled',
    value: function _touchForceEnabled(event) {
      event.preventDefault();
      Support.didSucceed('force');
    }
  }, {
    key: '_dispatch',
    value: function _dispatch() {
      if (!Support.forPressure) {
        Support.didFail();
        runClosure(this.block, 'unsupported', this.el);
      } else {
        this.el.removeEventListener('webkitmouseforcewillbegin', this._touchForceEnabled);
      }
    }

    // Start

  }, {
    key: 'start',
    value: function start() {
      var _this5 = this;

      // call 'start' when the mouse goes down
      this.el.addEventListener('mousedown', function () {
        if (Support.forPressure) {
          _this5._setDown();
          runClosure(_this5.block, 'start', _this5.el);
        }
      }, false);
    }
  }, {
    key: 'change',
    value: function change() {
      var _this6 = this;

      this.el.addEventListener('webkitmouseforcechanged', function (event) {
        if (Support.forPressure && event.webkitForce !== 0) {
          runClosure(_this6.block, 'change', _this6.el, _this6._normalizeForce(event.webkitForce), event);
        }
      }, false);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this7 = this;

      // call 'end' when the mouse goes up or leaves the element
      this.el.addEventListener('mouseup', function () {
        if (Support.forPressure) {
          _this7._setUp();
          runClosure(_this7.block, 'end', _this7.el);
        }
      }, false);
      this.el.addEventListener('mouseleave', function () {
        if (Support.forPressure) {
          if (_this7.state === 'down') {
            runClosure(_this7.block, 'end', _this7.el);
          }
          _this7._setUp();
        }
      }, false);
    }
  }, {
    key: '_preventDefaultForceTouch',
    value: function _preventDefaultForceTouch() {
      // prevent the default force touch action for bound elements
      this.el.addEventListener('webkitmouseforcewillbegin', function (event) {
        if (Support.forPressure) {
          event.preventDefault();
        }
      }, false);
    }
  }, {
    key: '_setUp',
    value: function _setUp() {
      this.state = 'up';
    }
  }, {
    key: '_setDown',
    value: function _setDown() {
      this.state = 'down';
    }

    // make the force the standard 0 to 1 scale and not the 1 to 3 scale

  }, {
    key: '_normalizeForce',
    value: function _normalizeForce(force) {
      return (force - 1) / 2;
    }
  }]);

  return TouchForceAdapter;
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

var loopPressureElements = function loopPressureElements(selector, closure, type) {
  var css = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  var elements = queryElement(selector);
  for (var i = 0; i < elements.length; i++) {
    // override css if they don't want it set
    if (css) {
      elements[i].style.webkitUserSelect = "none";
      // elements[i].style.cursor = "pointer";
    }
    var el = new Element(elements[i], closure, type);
    el.routeEvents();
  }
};

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

// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
}(window, document));
