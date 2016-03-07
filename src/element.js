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
    if(Support.mobile === false && (this.type === 'force' || this.type !== '3d')){
      new AdapterForceTouch(this);
    }
    // if on mobile and requesting 3D Touch or not requestion Force Touch
    else if(Support.mobile === true && (this.type === '3d' || this.type !== 'force')){
      new Adapter3DTouch(this);
    }
    // if it is requesting a type and your browser is of other type
    else{
      this.instantFail();
    }
  }

  instantFail(){
    this.element.addEventListener(Support.mobile ? 'touchstart' : 'mousedown', () => runClosure(this.block, 'unsupported', this.element), false);
  }

}
