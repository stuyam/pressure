class Element{

  constructor(element, block, options){
    this.el = element;
    this.block = block;
    this.options = options;
    this.type = Config.get('only', options);
    this.routeEvents();
    this.preventSelect();
    this.polyfill = new AdapterPolyfill(this);
  }

  routeEvents(){
    // if on desktop and requesting Force Touch or not requesting 3D Touch
    if(isDesktop && (this.type === 'desktop' || this.type !== 'mobile')){
      new AdapterForceTouch(this);
    }
    // if on mobile and requesting 3D Touch or not requestion Force Touch
    else if(isMobile && (this.type === 'mobile' || this.type !== 'desktop')){
      new Adapter3DTouch(this);
    }
    // unsupported if it is requesting a type and your browser is of other type
    else{
      this.el.addEventListener(isMobile ? 'touchstart' : 'mousedown', (event) => this.runClosure('unsupported', event), false);
    }
  }

  // prevent the default action of text selection, "peak & pop", and force touch special feature
  preventSelect(){
    if(Config.get('preventSelect', this.options)){
      this.el.style.webkitTouchCallout = "none";
      this.el.style.webkitUserSelect = "none";
      this.el.style.khtmlUserSelect = "none";
      this.el.style.MozUserSelect = "none";
      this.el.style.msUserSelect = "none";
      this.el.style.userSelect = "none";
    }
  }

}
