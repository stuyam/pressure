// This class holds the states of the the Pressure config
var Config = {

  preventDefault: true,

  only: null,

  polyfill: false,

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
