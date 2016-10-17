/*
This is the base adapter from which all the other adapters extend.
*/

class Adapter{

  constructor(element){
    this.element = element;
    this.el = element.el;
    this.block = element.block;
    this.pressed = false;
    this.deepPressed = false;
    this.nativeSupport = false;
  }

  add(event, set){
    this.el.addEventListener(event, set, false);
  }

  setPressed(boolean){
    this.pressed = boolean;
  }

  setDeepPressed(boolean){
    this.deepPressed = boolean;
  }

  isPressed(){
    return this.pressed;
  }

  isDeepPressed(){
    return this.deepPressed;
  }

  // run the closure if the property exists in the object
  runClosure(method){
    if(this.block.hasOwnProperty(method)){
      // call the closure method and apply nth arguments if they exist
      this.block[method].apply(this.el, Array.prototype.slice.call(arguments, 1));
    }
  }

  failOrPolyfill(event){
    // is the polyfill option set
    if(Config.get('polyfill', this.options)){
      this.runPolyfill(event);
    } else {
      this.runClosure('unsupported', event);
    }
  }

  _startPress(event){
    if(this.isPressed() === false){
      this.nativeSupport = true;
      this.setPressed(true);
      this.runClosure('start', event);
    }
  }

  _startDeepPress(event){
    if(this.isPressed() && this.isDeepPressed() === false){
      this.setDeepPressed(true);
      this.runClosure('startDeepPress', event);
    }
  }

  _endDeepPress(){
    if(this.isPressed() && this.isDeepPressed()){
      this.setDeepPressed(false);
      this.runClosure('endDeepPress');
    }
  }

  _endPress(){
    if(this.isPressed()){
      this.nativeSupport = false;
      this._endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
      this.element.polyfill.force = 0;
    }
  }

  runPolyfill(event){
    this.increment = 10 / Config.get('polyfillSpeed', element.options);
    this.runClosure('start', event);
    this.loopForce(event, 0);
  }

  loopPolyfillForce(event, force){
    if(this.isPressed()) {
      this.runClosure('change', force, event);
      force >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
      force = force + this.increment > 1 ? 1 : force + this.increment;
      setTimeout(this.loopForce.bind(this, force), 10, event);
    }
  }

}
