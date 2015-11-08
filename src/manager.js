// var runClosure = function(closure, method){
//   if(closure.hasOwnProperty(method)){
//     closure[method]();
//   }
//   // if(isObject(closure)){
//   //   runObjectClosure(closure);
//   // } else {
//   //   if(Support.forPressure){
//   //     closure();
//   //   }
//   // }
// }

// // runs the proper closures for the user if the closure is an object
// var runObjectClosure = function(closure){
//   if(Support.forPressure && closure.hasOwnProperty('success')){
//     closure.success();
//   } else if(!Support.forPressure && closure.hasOwnProperty('fail')){
//     closure.fail(failureObject());
//   }
// }

var getSuccessClosure = function(closure){
  if(isObject(closure)){
    if(closure.hasOwnProperty('success')){
      return closure.success;
    }
  } else {
    return closure;
  }
}

var getFailClosure = function(closure){
  var fail = function(){}
  if(isObject(closure)){
    if(closure.hasOwnProperty('fail')){
      fail = closure.fail;
    }
  }
  return fail;
}

// Standardized error reporting
var failureObject = function(errorType){
  var type = errorType || Support.failureType;
  switch (type) {
    case 'browser':
      var message = 'Browser does not support Force Touch or 3D Touch.';
      break;
    case 'device':
      var message = 'Device does not support Force Touch or 3D Touch.';
      break;
    case '3d':
      var message = 'Browser does support Force Touch but not 3D Touch.';
      break;
    case 'force':
      var message = 'Browser does support 3D Touch but not Force Touch.';
      break;
    // XXX: these maybe's are exactly correct
    case '3d-maybe':
      var message = 'Browser may support Force Touch but not 3D Touch.';
      break;
    case 'force-maybe':
      var message = 'Browser may support 3D Touch but not Force Touch.';
      break;
  }
  return {
    'error' : {
      'type'    : type,
      'message' : message
    }
  }
}
