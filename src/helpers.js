//------------------- Helpers Section -------------------//

var loopPressureElements = function(selector, closure, type, css = true){
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    // override css if they don't want it set
    if(css){
      elements[i].style.webkitUserSelect = "none";
      // elements[i].style.cursor = "pointer";
    }
    var el = new Element(elements[i], closure, type);
    el.routeEvents();
  }
}

// run the closure if the property exists in the object
var runClosure = function(closure, method, element){
  if(closure.hasOwnProperty(method)){
    // call the closure method and apply nth arguments if they exist
    closure[method].apply(element || this, Array.prototype.slice.call(arguments, 3));
  }
}

// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object (or module for npm) so it can be called from inside the self executing anonymous function
if(window !== false){
  if ( typeof module === "object" && typeof module.exports === "object" ) {
  // For CommonJS and CommonJS-like environments where a proper `window`
  // is present, execute Pressure.
  // For environments that do not have a `window` with a `document`
  // (such as Node.js) Pressure does not work
    module.exports = Pressure;
  } else {
    window.Pressure = Pressure;
  }
} else {
  throw new Error( "Pressure requires a window with a document" );
}
