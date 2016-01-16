# pressure.js
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
    this.innerHTML = forcel
  }
});
```
OR use it with browserify or CommonJS like setups:
```javascript
var Pressure = require('pressure');

Pressure.set('#id-name', {
  change: function(force){
    this.innerHTML = forcel
  }
});
```


## Usage
NOTE: the "this" keyword in each of the callback methods will be the element itself that has force applied to it
```javascript
Pressure.set('#element', {
  start: function(){
    // this is called on force start
  },
  end: function(){
    // this is called on force end
  },
  startDeepPress: function(){
    // this is called on "force click" / "deep press", aka once the force is greater than 0.5
  },
  endDeepPress: function(){
    // this is called when the "force click" / "deep press" end
  },
  change: function(force, event){
    // this is called every time there is a change in pressure
  },
  unsupported: function(){
    // this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
  }
});
```
