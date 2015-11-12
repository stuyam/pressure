// This class holds the states of the the Pressure support the user has
var Support = {

  hasRun: false,

  forPressure: false,

  type: false,

  // failureType: '',

  // mobile: '',

  // browserFail(){
  //   this.didFail('browser');
  // },

  // deviceFail(){
  //   this.didFail('device');
  // },

  didFail(){
    this.hasRun = true;
    this.forPressure = false;
    // this.failureType = type;
  },

  didSucceed(type){
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
}
