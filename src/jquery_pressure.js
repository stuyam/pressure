//--------------------- Public jQuery API Section ---------------------//

if($ !== false){

  $.fn.pressure = function(closure, options) {
    loopPressureElements(this, closure, options);
    return this;
  };

  $.pressureConfig = function(options){
    Config.set(options);
  },

  $.pressureMap = function(x, in_min, in_max, out_min, out_max) {
    return map(x, in_min, in_max, out_min, out_max);
  };

} else {
  throw new Error( "Pressure jQuery requires jQuery is loaded before your jquery.pressure.min.js file" );
}
