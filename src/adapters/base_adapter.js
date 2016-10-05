class BaseAdapter{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.pressed = false;
    this.deepPressed = false;
    this.preventDefault();
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

  failOrPolyfill(event){
    // is the polyfill option set
    if(Config.get('polyfill', this.element.options)){
      this.polyfill = new AdapterPolyfill(this.element, event);
    } else {
      this.runClosure('unsupported');
    }
  }

  // run the closure if the property exists in the object
  runClosure(method){
    if(this.block.hasOwnProperty(method)){
      // call the closure method and apply nth arguments if they exist
      this.block[method].apply(this.el || this, Array.prototype.slice.call(arguments, 1));
    }
  }

  // prevent the default action of text selection, "peak & pop", and force touch special feature
  preventDefault(){
    if(Config.get('preventDefault', this.element.options)){
      this.el.style.webkitTouchCallout = "none";
      this.el.style.userSelect = "none";
      this.el.style.webkitUserSelect = "none";
      this.el.style.MozUserSelect = "none";
    }
  }

}
