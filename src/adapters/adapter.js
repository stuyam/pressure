/*
This is the base adapter from which all the other adapters extend.
*/

class Adapter{

  constructor(element){
    this.element = element;
    this.el = element.el;
    this.block = element.block;
    this.runClosure = element.runClosure;
    this.pressed = false;
    this.deepPressed = false;
  }

  add(event, set){
    this.el.addEventListener(event, set, false);
  }

  remove(event, set){
    this.el.removeEventListener(event, set);
  }

  setPressed(boolean){
    this.pressed = boolean;
  }

  setDeepPressed(boolean){
    this.deepPressed = boolean;
  }

}
