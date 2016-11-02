//--------------------- Public jQuery API Section ---------------------//

if($){

  $.fn.pressure = function(closure, options) {
    loopPressureElements(this, closure, options);
    return this;
  };

  $.pressureConfig = function(options){
    Config.set(options);
  };

  $.pressureMap = function(x, in_min, in_max, out_min, out_max) {
    return map.apply(null, arguments);
  };

} else {
  throw new Error( "Pressure jQuery requires jQuery to be loaded." );
}
