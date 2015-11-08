//------------------- Helpers Section -------------------//

// run the closure if the property exists in the object
var runClosure = function(closure, method){
  if(closure.hasOwnProperty(method)){
    // call the closure method and apply nth arguments if they exist
    closure[method].apply(this, Array.prototype.slice.call(arguments, 2));
  }
}

// return all elements that match the query selector
var queryElement = function(selector){
  return document.querySelectorAll(selector);
}

// loops over each item quered and calls the closure
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
}

// Helper to check if input it an object
var isObject = function(input){
  return input !== null && typeof input === 'object'
}
