class Element{

  constructor(element, block, options){
    this.element = element;
    this.block = block;
    this.type = Config.get('only', options);
    this.options = options;
    this.routeEvents();
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
    // if it is requesting a type and your browser is of other type
    else{
      this.instantFail();
    }
  }

  instantFail(){
    this.element.addEventListener(isMobile ? 'touchstart' : 'mousedown', () => runClosure(this.block, 'unsupported', this.element), false);
  }

}
