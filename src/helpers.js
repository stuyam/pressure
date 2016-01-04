//------------------- Helpers Section -------------------//

var loopPressureElements = function(selector, closure, type, css = true){
  // if a string is passed in as an element
  if(typeof selector === 'string' || selector instanceof String){
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
      runPressureElement(elements[i], closure, type, css);
    }
  // if an element object is passed in
  } else if(isElement(selector)){
    runPressureElement(selector, closure, type, css);
  // if a node list is passed in ex. jQuery $() object
  } else {
    for (var i = 0; i < selector.length; i++) {
      runPressureElement(selector[i], closure, type, css);
    }
  }
}

var runPressureElement = function(element, closure, type, css){
  if(css){
    element.style.webkitUserSelect = "none";
    // elements[i].style.cursor = "pointer";
  }
  var el = new Element(element, closure, type);
  el.routeEvents();
}

//Returns true if it is a DOM element
var isElement = function(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
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
