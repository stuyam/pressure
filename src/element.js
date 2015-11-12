class Element{

  constructor(element, block, type){
    this.element = element;
    this.block = block;
    this.type = type;
  }

  routeEvents(){
    // if on desktop and requesting Force Touch
    if(Support.mobile === false && this.type === 'force'){
      this.addMouseEvents();
    }
    // if on mobile and requesting 3D Touch
    else if(Support.mobile === true && this.type === '3d'){
      this.addTouchEvents();
    }
    // if on desktop and NOT requesting 3D Touch
    else if(Support.mobile === false && this.type !== '3d'){
      this.addMouseEvents();
    }
    // if on mobile and NOT requesting Force Touch
    else if(Support.mobile === true && this.type !== 'force'){
      this.addTouchEvents();
    }
    // else make sure the fail events are setup
    else{
      this.failEvents();
    }
  }

  addMouseEvents(){
    // check for Force Touch
    this.element.addEventListener('webkitmouseforcewillbegin', this.touchForceEnabled, false);
    this.always();
    var touchForce = new TouchForce(this);
    touchForce.bindEvents();
  }

  addTouchEvents(){
    // check for 3D Touch
    this.element.addEventListener('touchstart', this.touch3DEnabled, false);
    this.always();
    var touch3D = new Touch3D(this);
    touch3D.bindEvents();
  }

  always(){
    if(Support.mobile){
      this.element.addEventListener('touchstart', this.dispatch.bind(this), false);
    } else {
      this.element.addEventListener('mousedown', this.dispatch.bind(this), false);
    }
  }

  failEvents(){
    if(Support.mobile){
      this.element.addEventListener('mousedown', () => runClosure(this.block, 'unsupported'), false);
    } else {
      this.element.addEventListener('touchstart', () => runClosure(this.block, 'unsupported'), false);
    }
  }

  touchForceEnabled(event){
    event.preventDefault()
    Support.didSucceed('force');
  }

  touch3DEnabled(event){
    if(event.touches[0].force !== undefined){
      Support.didSucceed('3d');
    }
  }

  dispatch(){
    if(!Support.forPressure){
      Support.didFail();
      runClosure(this.block, 'unsupported', this.element);
    } else {
      this.element.removeEventListener('webkitmouseforcewillbegin', this.touchForceEnabled);
      this.element.removeEventListener('touchstart', this.touch3DEnabled);
    }
  }

}
