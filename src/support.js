// This class holds the states of the the Pressure support the user has
var Support = {

  hasRun: false,

  forPressure: false,

  type: '',

  failureType: '',

  browserFail: function(){
    this.didFail('browser');
  },

  deviceFail: function(){
    this.didFail('device');
  },

  didFail: function(type){
    this.hasRun = true;
    this.forPressure = false;
    this.failureType = type;
  },

  didSucceed: function(type){
    this.hasRun = true;
    this.forPressure = true;
    this.type = type;
  }
}
