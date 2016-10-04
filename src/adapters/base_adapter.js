class BaseAdapter{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
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

  failOrPolyfill(event){
    // is the polyfill option set
    if(Config.get('polyfill', this.element.options) === true){
      this.polyfill = new AdapterPolyfill(this.element, event);
    } else {
      runClosure(this.block, 'unsupported', this.el);
    }
  }

  // run the closure if the property exists in the object
  runClosure(method){
    if(this.block.hasOwnProperty(method)){
      // call the closure method and apply nth arguments if they exist
      closure[method].apply(this.el || this, Array.prototype.slice.call(arguments, 1));
    }
  }

  // prevent the default action of text selection, "peak & pop", and force touch special feature
  preventDefault(event){
    if(Config.get('preventDefault', this.element.options) === true){
      event.preventDefault();
      this.el.style.webkitTouchCallout = "none";
      this.el.style.userSelect = "none";
      this.el.style.webkitUserSelect = "none";
      this.el.style.MozUserSelect = "none";
    }
  }

}
