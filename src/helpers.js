//------------------- Helpers Section -------------------//

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

// http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
var hasOwnProperty = function(obj, prop) {
  var proto = obj.__proto__ || obj.constructor.prototype;
  return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
}

// Helper to check if input it an object
var isObject = function(input){
  return input !== null && typeof input === 'object'
}
