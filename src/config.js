// This class holds the states of the the Pressure config
var Config = {

  // 'false' will make polyfill not run when pressure is not supported and the 'unsupported' method will be called
  polyfill: true,

  // milliseconds it takes to go from 0 to 1 for the polyfill
  polyfillSpeedUp: 1000,

  // milliseconds it takes to go from 1 to 0 for the polyfill
  polyfillSpeedDown: 0,

  // 'true' prevents the selecting of text and images via css properties
  preventSelect: true,

  // 'touch', 'mouse', or 'pointer' will make it run only on that type of device
  only: null,

  // this will get the correct config / option settings for the current pressure check
  get(option, options){
    return options.hasOwnProperty(option) ? options[option] : this[option];
  },

  // this will set the global configs
  set(options){
    for (var k in options) {
      if (options.hasOwnProperty(k) && this.hasOwnProperty(k) && k != 'get' && k != 'set') {
        this[k] = options[k];
      }
    }
  }

}
