// Get back a change value on all elements matching the selector
Pressure.change('#el1', function(force, event){
  // "this" is the element(s) returned by the closure
  this.style.width = Math.max((200 * force), 200) + 'px';
  this.innerHTML = force;
  console.log('el1');
});

// Get back a change value on ONLY elements that support Force Touch (New Mac's)
Pressure.changeForceTouch('#el2', function(force, event){
  this.style.width = Math.max((200 * force), 200) + 'px';
  this.innerHTML = force;
  console.log('el2');

});

// Get back a change value on ONLY elements that support 3D Touch (iPhone 6s & iPhone 6s Plus)
// TODO: BUG: this is also calling Force Touch
Pressure.change3DTouch('#el3', function(force, event){
  this.style.width = Math.max((200 * force), 200) + 'px';
  this.innerHTML = force;
  console.log('el3');

});

// Example of change method with a failure closure
// This structure can be used in any methods of Pressure
// The failure block will return with an "error" and message showing why the device doesn't support 3D Touch and Force Touch
Pressure.change('#el4', {
  success: function(force, event){
    this.style.width = Math.max((200 * force), 200) + 'px';
    this.innerHTML = force;
    console.log('el4');
  },
  // TODO: BUG: this error is returning undefined and not the correct error
  fail: function(error){
    console.log(error);
  }
});

// The "Supported" method is just a wrapper to determind if a browser / device supports 3D Touch or Force Touch
// If the browser does not support them, then the "fail" will be called immediately
// If the browser is supported but the device is not, a click somewhere on the page has to happen to determine success or failure
Pressure.supported({
  success:function(){
    console.log('User and Browser both support force touch');
  },
  fail: function(error){
    console.log(error);
  }
});
