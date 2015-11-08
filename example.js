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
// Pressure.set('#el1', {
//   start: function(){
//     console.log('started!');
//   },

//   change: function(force, event){
//     this.style.width = (200 * force + 200) + 'px';
//     this.innerHTML = force;
//   },

//   end: function(){
//     this.style.width = '200px';
//   },

//   unsupported: function(error){
//     console.log(error);
//   }
// });

// The "Supported" method is just a wrapper to determind if a browser / device supports 3D Touch or Force Touch
// If the browser does not support them, then the "fail" will be called immediately
// If the browser is supported but the device is not, a click somewhere on the page has to happen to determine success or failure
Pressure.support3DTouch({
  success:function(){
    console.log('User and Browser both support force touch');
  },
  // if the browser does not support 3D or force touch this will be called as soon as it is loaded on the page
  failInstant: function(error){
    console.log('failInstant');
    console.log(error);
  },
  // if the browser is supported but the device is not (example: MacBook Air on El Capitan in Safari), this will be called whenever the first click is made anywhere on the page
  // this can't be called immediately on page load because it impossible to test the device support without testing a click on the page
  failLater: function(error){
    console.log('failLater');
    console.log(error);
  }

});
