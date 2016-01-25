class Adapter{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.down = false;
    this.deepDown = false;
  }

  add(event, set){
    this.el.addEventListener(event, set, false);
  }

  remove(event, set){
    this.el.removeEventListener(event, set);
  }

  _setDown(){
    this.down = true;
  }

  _setUp(){
    this.down = false;
  }

  _setDeepDown(){
    this.deepDown = true;
  }

  _setDeepUp(){
    this.deepDown = false;
  }

}
