// This class holds the states of the the Pressure support the user has
var Support = {

  hasRun: false,

  forPressure: false,

  type: false,

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
