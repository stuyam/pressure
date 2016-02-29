# pressure.js

[![Join the chat at https://gitter.im/yamartino/pressure](https://badges.gitter.im/yamartino/pressure.svg)](https://gitter.im/yamartino/pressure?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub Rank](http://reporank.com/yamartino/pressure)](http://reporank.com)

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
