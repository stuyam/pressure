var callClosure = function(closure){
  if(isObject(closure)){
    runObjectClosure(closure);
  } else {
    if(Support.forPressure){
      closure();
    }
  }
}

// runs the proper closures for the user if the closure is an object
var runObjectClosure = function(closure){
  if(Support.forPressure && hasOwnProperty(closure, 'success')){
    closure.success();
  } else if(!Support.forPressure && hasOwnProperty(closure, 'fail')){
    closure.fail(failureObject());
  }
}

var getSuccessClosure = function(closure){
  if(isObject(closure)){
    if(hasOwnProperty(closure, 'success')){
      return closure.success;
    }
  } else {
    return closure;
  }
}

var getFailClosure = function(closure){
  var fail = function(){}
  if(isObject(closure)){
    if(hasOwnProperty(closure, 'fail')){
      fail = closure.fail;
    }
  }
  return fail;
}

// Standardized error reporting
var failureObject = function(){
  switch (Support.failureType) {
    case 'browser':
      var message = 'Browser does not support Force Touch or 3D Touch.';
      break;
    case 'device':
      var message = 'Device does not support Force Touch or 3D Touch.';
      break;
  }
  return {
    'error' : {
      'type'    : Support.failureType,
      'message' : message
    }
  }
}
