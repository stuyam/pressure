//--------------------- Public API Section ---------------------//
// this is the start of the Pressure Object, this is the only object that is accessible to the end user
// only the methods in this object can be called, making it the "public api"
var Pressure = {

  // targets any device with Force of 3D Touch
  set: function(selector, closure){
    Router.set(selector, closure);
  },

  // targets ONLY devices with Force Touch
  setForceTouch: function(selector, closure){
    Router.set(selector, closure, 'force');
  },

  // targets ONLY devices with 3D touch
  set3DTouch: function(selector, closure){
    Router.set(selector, closure, '3d');
  },

  // this method is to determine if the browser and/or user have support for force touch of 3D touch
  // when this method is run, it will immediatly return if the browser does not support the force/3D touch,
  // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
  // support: function(closure){
  //   Browser.checkSupport(closure);
  // },

  // supportForceTouch: function(closure){
  //   Browser.checkSupport(closure, 'force');
  // },

  // support3DTouch: function(closure){
  //   Browser.checkSupport(closure, '3d');
  // },

}
