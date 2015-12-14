//--------------------- Public API Section ---------------------//
// this is the start of the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch
  set(selector, closure, css){
    loopPressureElements(selector, closure, null, css);
  },

  // targets ONLY devices with Force Touch
  setForceTouch(selector, closure, css){
    loopPressureElements(selector, closure, 'force', css);
  },

  // targets ONLY devices with 3D touch
  set3DTouch(selector, closure, css){
    loopPressureElements(selector, closure, '3d', css);
  },

  // the interpolate method allows for interpolating a value between two values based on two input values
  // example from the Arduino documentation: https://www.arduino.cc/en/Reference/Map
  interpolate(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  },

  // map is an alias for the above 'interpolate' method
  map(){
    return this.interpolate(...arguments);
  }

}
