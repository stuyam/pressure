class Element{

  constructor(el, block, options){
    this.routeEvents(el, block, options);
    this.preventSelect(el, options);
  }

  routeEvents(el, block, options){
    var type = Config.get('only', options);
    // for devices that support pointer events
    if(supportsPointer && (type === 'pointer' || type === null)){
      this.adapter = new AdapterPointer(el, block, options).bindEvents();
    }
    // for devices that support 3D Touch
    else if(supportsTouch && (type === 'touch' || type === null)){
      this.adapter = new Adapter3DTouch(el, block, options).bindEvents();
    }
    // for devices that support Force Touch
    else if(supportsMouse && (type === 'mouse' || type === null)){
      this.adapter = new AdapterForceTouch(el, block, options).bindEvents();
    }
    // unsupported if it is requesting a type and your browser is of other type
    else{
      this.adapter = new Adapter(el, block).bindUnsupportedEvent();
    }
  }

  // prevent the default action of text selection, "peak & pop", and force touch special feature
  preventSelect(el, options){
    if(Config.get('preventSelect', options)){
      el.style.webkitTouchCallout = "none";
      el.style.webkitUserSelect = "none";
      el.style.khtmlUserSelect = "none";
      el.style.MozUserSelect = "none";
      el.style.msUserSelect = "none";
      el.style.userSelect = "none";
    }
  }

}
