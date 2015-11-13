//------------------- Helpers Section -------------------//

var loopPressureElements = function(selector, closure, type, css = true){
  var elements = queryElement(selector);
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

// return all elements that match the query selector
var queryElement = function(selector){
  return document.querySelectorAll(selector);
}

// Check if the device is mobile or desktop
Support.mobile = 'ontouchstart' in document;

// Assign the Pressure object to the global object so it can be called from inside the self executing anonymous function
window.Pressure = Pressure;
