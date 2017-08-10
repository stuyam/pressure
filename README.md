# Pressure.js

[![Join the chat at https://gitter.im/yamartino/pressure](https://badges.gitter.im/yamartino/pressure.svg)](https://gitter.im/stuyam/pressure?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm https://www.npmjs.com/package/pressure](https://img.shields.io/npm/v/pressure.svg)](https://www.npmjs.com/package/pressure)
[![npm https://www.npmjs.com/package/pressure](https://img.shields.io/npm/dt/pressure.svg)](https://www.npmjs.com/package/pressure)

![Pressure Example](http://pressurejs.com/img/pressure.gif)

Pressure is a JavaScript library for handling both Force Touch and 3D Touch on the web, bundled under one library with a simple API that makes working with them painless.

Head over to the [documentation](http://pressurejs.com/documentation.html) for installation instructions, supported devices, and more details on pressure.js.

## Install
Download pressure.min.js or pressure.js files from GitHub or install with npm or bower
#### npm
```
npm install pressure --save
```
#### bower
```
bower install pressure --save
```


## Setup
Use pressure in the global space:
```javascript
Pressure.set('#id-name', {
  change: function(force){
    this.innerHTML = force;
  }
});
```
OR use it with browserify or CommonJS like setups:
```javascript
var Pressure = require('pressure');

Pressure.set('#id-name', {
  change: function(force){
    this.innerHTML = force;
  }
});
```


## Usage
NOTE: the "this" keyword in each of the callback methods will be the element itself that has force applied to it
```javascript
Pressure.set('#element', {
  start: function(event){
    // this is called on force start
  },
  end: function(){
    // this is called on force end
  },
  startDeepPress: function(event){
    // this is called on "force click" / "deep press", aka once the force is greater than 0.5
  },
  endDeepPress: function(){
    // this is called when the "force click" / "deep press" end
  },
  change: function(force, event){
    // this is called every time there is a change in pressure
    // force will always be a value from 0 to 1 on mobile and desktop
  },
  unsupported: function(){
    // NOTE: this is only called if the polyfill option is disabled!
    // this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
  }
});
```


## jQuery Usage
NOTE: the "this" keyword in each of the callback methods will be the element itself that has force applied to it
```javascript
$('#element').pressure({
  start: function(event){
    // this is called on force start
  },
  end: function(){
    // this is called on force end
  },
  startDeepPress: function(event){
    // this is called on "force click" / "deep press", aka once the force is greater than 0.5
  },
  endDeepPress: function(){
    // this is called when the "force click" / "deep press" end
  },
  change: function(force, event){
    // this is called every time there is a change in pressure
    // force will always be a value from 0 to 1 on mobile and desktop
  },
  unsupported: function(){
    // NOTE: this is only called if the polyfill option is disabled!
    // this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
  }
});
```

## Options
With Pressure, the third paramater is an optional object of options that can be passed in.

### Polyfill Support
Using the "polyfill" keyword, you can disable polyfill support for the element. The polyfill is enabled by default and is useful if the device or browser does not support pressure, it will fall back to using time. For example instead of force from 0 to 1, it counts up from 0 to 1 over the course of one second, as long as you are holding the element. Try some of the examples on the main page on a devices that does not support pressure and see for yourself how it works.
```javascript
Pressure.set('#example', {
  change: function(force, event){
    this.innerHTML = force;
  },
  unsupported: function(){
    alert("Oh no, this device does not support pressure.");
  }
}, {polyfill: false});
```

### Polyfill Speed Up
If you are using the polyfill (on by default), you can see the "polyfillSpeedUp" speed to determine how fast the polyfill takes to go from 0 to 1. The value is an integer in milliseconds and the default is 1000 (1 second).
```javascript
Pressure.set('#example', {
  change: function(force, event){
    this.innerHTML = force;
  }
}, {polyfillSpeedUp: 5000});
// takes 5 seconds to go from a force value of 0 to 1
// only on devices that do not support pressure
```

### Polyfill Speed Down
If you are using the polyfill (on by default), you can see the "polyfillSpeedDown" speed to determine how fast the polyfill takes to go from 1 to 0 when you let go. The value is an integer in milliseconds and the default is 0 (aka off).
```javascript
Pressure.set('#example', {
  change: function(force, event){
    this.innerHTML = force;
  }
}, {polyfillSpeedDown: 2000});
// takes 2 seconds to go from a force value of 1 to 0
// only on devices that do not support pressure
```

### Only run on Force Touch trackpads (mouse)
Set the option only to the type you want it to run on 'mouse', 'touch', or 'pointer'. The names are the types of events that pressure will respond to.
```javascript
Pressure.set('#example',{
  change: function(force, event){
    console.log(force);
  },
}, {only: 'mouse'});
```
### Only run on 3D Touch (touch)
```javascript
Pressure.set('#example',{
  change: function(force, event){
    console.log(force);
  },
}, {only: 'touch'});
```
### Only run on Pointer Supported Devices (pointer)
```javascript
Pressure.set('#example',{
  change: function(force, event){
    console.log(force);
  },
}, {only: 'pointer'});
```

### Change the preventSelect option
The preventDefault option in "true" by default and it prevents the default actions that happen on 3D "peel and pop" actions and the Force "define word" actions as well as other defaults. To allow the defaults to run set preventDefault to "false"
```javascript
Pressure.set('#example',{
  change: function(force, event){
    console.log(force);
  },
}, {preventSelect: false});
```

## Helpers

### Config
You can use ```Pressure.config()``` to set default configurations for site wide setup. All of the configurations are the same as the options listed above.

*Heads Up: If you have a config set, you can always overide the config on individual Pressure elements by passing in any of the options listed above to a specific Pressure block.*

**When using the jQuery Pressure library, use ```$.pressureConfig()``` rather than ```Pressure.map()```**
```javascript
// These are the default configs set by Pressure
Pressure.config({
  polyfill: true,
  polyfillSpeedUp: 1000,
  polyfillSpeedDown: 0,
  preventDefault: true,
  only: null
});
```

### Map
You can use ```Pressure.map()``` to map a value from one range of values to another. It takes 5 params: ```Pressure.map(inputValue, inputValueMin, inputValueMax, mapToMin, mapToMax);``` Here is a good write up on how this works in the Processing framework: [Map Function](https://processing.org/reference/map_.html).

**When using the jQuery Pressure library, use ```$.pressureMap()``` rather than ```Pressure.map()```**
```javascript
Pressure.set('#element', {
  change: function(force, event){
    // this takes the force, given that the force can range from 0 to 1, and maps that force value on a 100 to 200 range
    this.style.width = Pressure.map(force, 0, 1, 100, 200);
  }
});
```
