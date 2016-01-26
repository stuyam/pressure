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
