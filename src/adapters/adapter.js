/*
This is the base adapter from which all the other adapters extend.
*/

class Adapter{

  constructor(element){
    this.element = element;
    this.el = element.el;
    this.block = element.block;
    this.runClosure = element.runClosure;
  }

  add(event, set){
    this.el.addEventListener(event, set, false);
  }

  setPressed(boolean){
    this.element.pressed = boolean;
  }

  setDeepPressed(boolean){
    this.element.deepPressed = boolean;
  }

  isPressed(){
    return this.element.pressed;
  }

  isDeepPressed(){
    return this.element.deepPressed;
  }

  _startPress(event){
    if(this.isPressed() === false){
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
      this._endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
      this.element.polyfill.force = 0;
    }
  }

}
