class Element{

  constructor(element, block, type){
    this.element = element;
    this.block = block;
    this.type = type;
  }

  routeEvents(){
    // if on desktop and requesting Force Touch or not requesting 3D Touch
    if(Support.mobile === false && (this.type === 'force' || this.type !== '3d')){
      this.touchForceAdapter();
    }
    // if on mobile and requesting 3D Touch or not requestion Force Touch
    else if(Support.mobile === true && (this.type === '3d' || this.type !== 'force')){
      this.touch3DAdapter();
    }
    // if it is requesting a type and your browser is of other type
    else{
      this.failEvents();
    }
  }

  touchForceAdapter(){
    var adapter = new Adapter(new TouchForceAdapter(this));
    adapter.handle();
  }

  touch3DAdapter(){
    var adapter = new Adapter(new Touch3DAdapter(this));
    adapter.handle();
  }

  failEvents(){
    if(Support.mobile){
      this.element.addEventListener('touchstart', () => runClosure(this.block, 'unsupported'), false);
    } else {
      this.element.addEventListener('mousedown', () => runClosure(this.block, 'unsupported'), false);
    }
  }

}
