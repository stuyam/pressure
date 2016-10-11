class BaseAdapter{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.pressed = false;
    this.deepPressed = false;
    this.supported = false;
    this.preventSelect();
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

  setSupport(boolean){
    this.supported = boolean;
  }

  failOrPolyfill(event){
    // is the polyfill option set
    if(Config.get('polyfill', this.element.options)){
      // if the polyfill is not set, set it
      if(this.polyfill instanceof AdapterPolyfill === false){
        this.polyfill = new AdapterPolyfill(this.element);
      }
      this.polyfill.runEvent(event);
    } else {
      this.runClosure('unsupported', event);
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
  preventSelect(){
    if(Config.get('preventSelect', this.element.options)){
      this.el.style.webkitTouchCallout = "none";
      this.el.style.webkitUserSelect = "none";
      this.el.style.khtmlUserSelect = "none";
      this.el.style.MozUserSelect = "none";
      this.el.style.msUserSelect = "none";
      this.el.style.userSelect = "none";
    }
  }

}
