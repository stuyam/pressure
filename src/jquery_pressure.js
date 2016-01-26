//--------------------- Public jQuery API Section ---------------------//

$.fn.pressure = function(closure, options) {
  loopPressureElements(this, closure, options);
  return this;
};

$.fn.pressureMap = function(x, in_min, in_max, out_min, out_max) {
  return map(x, in_min, in_max, out_min, out_max);
};

