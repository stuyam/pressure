// // Get back a change value on all elements matching the selector
// Pressure.change('#el1', function(force, event){
//   console.log(force);
//   // "this" is the element(s) returned by the closure
//   this.style.width = (200 * force + 200) + 'px';
//   // this.innerHTML = force;
// });

// // // Get back a change value on ONLY elements that support Force Touch (New Mac's)
// // Pressure.changeForceTouch('#el2', function(force, event){
// //   this.style.width = Math.max((200 * force), 200) + 'px';
// //   this.innerHTML = force;
// // });

// // Get back a change value on ONLY elements that support 3D Touch (iPhone 6s & iPhone 6s Plus)
// Pressure.change('#el3', function(force, event){
//   this.style.width = (200 * force + 200) + 'px';
//   this.innerHTML = force;
// });

// Example of change method with a failure closure
// This structure can be used in any methods of Pressure
// The failure block will return with an "error" and message showing why the device doesn't support 3D Touch and Force Touch
var block = {
  start: function(){
    console.log('started!');
  },

  change: function(force, event){
    this.style.width = ((200 * force) + 200) + 'px';
    this.innerHTML = force;
    // this.style.background = "rgb(0," + map(force, 0, 1, 0, 255) + "," + map(force, 0, 1, 0, 255) + ")";
  },

  end: function(){
    console.log('ended!');
    this.style.width = '200px';
    this.innerHTML = 0;
  },

  unsupported: function(){
    console.log('UNSUPPORTED');
  }
}

Pressure.set('#el1', block);
Pressure.setForceTouch('#el2', block);
Pressure.set3DTouch('#el3', block);
Pressure.set('#el4', block);


function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Pressure.set('#el1', {
//   start: function(){
//     console.log('started!');
//   },

//   change: function(force, event){
//     this.style.width = ((200 * force) + 200) + 'px';
//     this.innerHTML = force;
//   },

//   end: function(){
//     console.log('ended!');
//     this.style.width = '200px';
//     this.innerHTML = 0;
//   },

//   unsupported: function(){
//     console.log('UNSUPPORTED');
//   }
// });

// The "Supported" method is just a wrapper to determind if a browser / device supports 3D Touch or Force Touch
// If the browser does not support them, then the "fail" will be called immediately
// If the browser is supported but the device is not, a click somewhere on the page has to happen to determine success or failure
// Pressure.support({
//   success:function(){
//     console.log('User and Browser both support force touch');
//   },
//   // if the browser does not support 3D or force touch this will be called as soon as it is loaded on the page
//   failOnLoad: function(error){
//     console.log('failInstant');
//     console.log(error);
//   },
//   // if the browser is supported but the device is not (example: MacBook Air on El Capitan in Safari), this will be called whenever the first click is made anywhere on the page
//   // this can't be called immediately on page load because it impossible to test the device support without testing a click on the page
//   failOnClick: function(error){
//     console.log('failLater');
//     console.log(error);
//   }

// });
