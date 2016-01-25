class Element{

  constructor(element, block, type, css){
    this.element = element;
    this.block = block;
    this.type = type;
    this.cssPrevention(css);
    this.routeEvents();
  }

  cssPrevention(css){
    if(css){
      this.element.style.webkitUserSelect = "none";
      this.element.style.webkitTouchCallout = "none";
      // elements[i].style.cursor = "pointer";
    }
  }

  routeEvents(){
    // if on desktop and requesting Force Touch or not requesting 3D Touch
    if(Support.mobile === false && (this.type === 'force' || this.type !== '3d')){
      this.bindAdapter(new AdapterTouchForce(this));
    }
    // if on mobile and requesting 3D Touch or not requestion Force Touch
    else if(Support.mobile === true && (this.type === '3d' || this.type !== 'force')){
      this.bindAdapter(new AdapterTouch3D(this))
    }
    // if it is requesting a type and your browser is of other type
    else{
      this.failEvents();
    }
  }

  // calls all of the public methods that need to setup the events on the element
  bindAdapter(adapter){
    adapter.support();
    adapter.start();
    adapter.change();
    adapter.end();
    adapter.startDeepPress();
    adapter.endDeepPress();
  }

  failEvents(){
    this.element.addEventListener(Support.mobile ? 'touchstart' : 'mousedown', () => runClosure(this.block, 'unsupported', this.element), false);
  }

}
