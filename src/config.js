// This class holds the states of the the Pressure config
var Config = {

  // 'true' prevents the default actions of an element that is pressed
  preventDefault: true,

  // 'mobile' or 'desktop' will make it run only on that type of device
  only: null,

  // 'true' will make polyfill run when pressure is not supported
  polyfill: false,

  // milliseconds it takes to go from 0 to 1 for the polyfill
  polyfillSpeed: 1000,

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
