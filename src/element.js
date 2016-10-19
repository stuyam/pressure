class Element{

  constructor(el, block, options){
    this.routeEvents(el, block, options);
    this.preventSelect(el, options);
  }

  routeEvents(el, block, options){
    var type = Config.get('only', options);
    // if on desktop and requesting Force Touch or not requesting 3D Touch
    if(isDesktop && (type === 'desktop' || type !== 'mobile')){
      this.adapter = new AdapterForceTouch(el, block, options).bindEvents();
    }
    // if on mobile and requesting 3D Touch or not requestion Force Touch
    else if(isMobile && (type === 'mobile' || type !== 'desktop')){
      this.adapter = new Adapter3DTouch(el, block, options).bindEvents();
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
