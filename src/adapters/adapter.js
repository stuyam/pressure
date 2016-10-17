/*
This is the base adapter from which all the other adapters extend.
*/

class Adapter{

  constructor(element){
    this.element = element;
    this.el = element.el;
    this.block = element.block;
    this.runClosure = element.runClosure;
    this.options = element.options;
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
    if(this.isPressed() && Config.get('polyfill', this.options)){
      this.nativeSupport = false;
      this._endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
    }
  }

  runPolyfill(event){
    // if(this.isPressed() && this.nativeSupport === false){
      this.increment = 10 / Config.get('polyfillSpeed', this.options);
      this.setPressed(true);
      this.runClosure('start', event);
      this.loopPolyfillForce(0, event);
    // }
  }

  loopPolyfillForce(force, event){
    if(this.isPressed()) {
      this.runClosure('change', force, event);
      force >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
      force = force + this.increment > 1 ? 1 : force + this.increment;
      setTimeout(this.loopPolyfillForce.bind(this, force, event), 10);
    }
  }

}
