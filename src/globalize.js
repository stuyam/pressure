// Assign the Pressure object to the global object (or module for npm) so it can be called from inside the self executing anonymous function
if(window !== false){
  // if Pressure is not defined, it is the jquery.pressure library and skip the next setup
  if(typeof Pressure !== "undefined"){
    // this if block came from: http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
    if(typeof define === "function" && define.amd) {
      // Now we're wrapping the factory and assigning the return
      // value to the root (window) and returning it as well to
      // the AMD loader.
      var pressure = Pressure;
      define(["pressure"], function(Pressure){
        return Pressure;
      });
    } else if(typeof module === "object" && module.exports) {
      // I've not encountered a need for this yet, since I haven't
      // run into a scenario where plain modules depend on CommonJS
      // *and* I happen to be loading in a CJS browser environment
      // but I'm including it for the sake of being thorough
      var pressure = Pressure;
      module.exports = pressure;
    } else {
      window.Pressure = Pressure;
    }
  }
} else {
  console.warn( "Pressure requires a window with a document" );
  // I can't put 'return' here because babel blows up when it is compiled with gulp
  // because it is not in a function. It is only put into the iife when gulp runs.
  // The next line is replaced with 'return;' when gulp runs.
  //REPLACE-ME-IN-GULP-WITH-RETURN
}
