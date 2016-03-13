//--------------------- Public API Section ---------------------//
// this is the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch
  set(selector, closure, options){
    loopPressureElements(selector, closure, options);
  },

  // set configuration options for global config
  config(options){
    Config.set(options);
  },

  // the map method allows for interpolating a value from one range of values to another
  // example from the Arduino documentation: https://www.arduino.cc/en/Reference/Map
  map(x, in_min, in_max, out_min, out_max){
    return map(x, in_min, in_max, out_min, out_max);
  }

}
