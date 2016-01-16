# pressure
Pressure is a JavaScript library that makes dealing with Apple's Force Touch and 3D Touch simple. Force Touch for new Macs and 3D Touch for the new iPhone 6s and 6s Plus, all bundled under one roof with a simple API that makes working with them painless.

Head over to the [documentation](http://yamartino.github.com/pressure) website for installation instructions and how to use pressure.js

## Basic Usage
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
