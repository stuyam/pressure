// This class holds the states of the the Pressure support the user has
var Support = {

  // if the support has already been checked
  hasRun: false,

  // if the device has support for pressure or not
  forPressure: false,

  // the type of support the device has "force" or "3d"
  type: false,

  // Check if the device is mobile or desktop
  mobile: 'ontouchstart' in document,

  didFail(){
    this.hasRun = true;
    this.forPressure = false;
  },

  didSucceed(type){
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
}
