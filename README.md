# pressure.js

[![Join the chat at https://gitter.im/yamartino/pressure](https://badges.gitter.im/yamartino/pressure.svg)](https://gitter.im/yamartino/pressure?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub Rank](https://reporank.com/yamartino/pressure)](https://reporank.com)

![Pressure Example](http://yamartino.github.io/pressure/pressure.gif)

Pressure is a JavaScript library that makes dealing with Apple's Force Touch and 3D Touch simple. Force Touch for new Macs and 3D Touch for the new iPhone 6s and 6s Plus, all bundled under one roof with a simple API that makes working with them painless.

Head over to the [documentation](http://yamartino.github.com/pressure) website for installation instructions and how to use pressure.js

## Install
download pressure.min.js or pressure.js files from GitHub or install with npm or bower
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
    // this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
  }
});
```

## Options

###Polyfill Support
With Pressure, the third paramater is an optional object of options that can be passed in. Using the "polyfill" keyword, you can enable polyfill support for the element. What this means is that if the device or browser does not support force or 3D touch, it will fall back to using time. For example instead of force from  0 to 1, it counts up from 0 to 1 over the course of one second, as long as you are holding the element. Try some of the examples on the [main page](http://pressurejs.com) on a devices that does not support force or 3D touch and see for yourself how it works.
```javascript
Pressure.set('#polyfill-example', {
  change: function(force, event){
    this.innerHTML = force;
  }
}, {polyfill: true});
```

### Only run on Force Touch trackpads (Mac)
Set the option only to the type you want it to run on 'force' or '3d'
```javascript
$('#element').pressure({
  change: function(force, event){
    console.log(force);
  },
}, {only: 'force'});
```
### Only run on 3D Touch (iPhone 6s)
```javascript
$('#element').pressure({
  change: function(force, event){
    console.log(force);
  },
}, {only: '3d'});
```

### Change the preventDefault option
The preventDefault option in "true" by default and it prevents the default actions that happen on 3D "peel and pop" actions and the Force "define word" actions as well as other defaults. To allow the defaults to run set preventDefault to "false"
```javascript
$('#element').pressure({
  change: function(force, event){
    console.log(force);
  },
}, {preventDefault: false});
```

## Helpers

### Config
You can use ```Pressure.config()``` to set default configurations for site wide setup. All of the configurations are the same as the options listed above.

*Heads Up: If you have a config set, you can always overide the config on individual Pressure elements by passing in any of the options listed above to a specific Pressure block.*

**When using the jQuery Pressure library, use ```$.pressureConfig()``` rather than ```Pressure.map()```**
```javascript
// These are the default configs set by Pressure
Pressure.config({
  polyfill: false,
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
