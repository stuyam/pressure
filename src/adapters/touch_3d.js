class Touch3D{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.touchDown = false;
  }

  bindEvents(){
    this.start();

    this.change();

    this.end();
  }

  start(){
    if(this.block.hasOwnProperty('start')){
      // call 'start' when the touch goes down
      this.el.addEventListener('touchstart', () => {
        if(Support.forPressure){
          runClosure(this.block, 'start', this.el);
        }
      }, false);
    }
  }

  change(){
    if(this.block.hasOwnProperty('change')){
      this.el.addEventListener('touchstart', (event) =>{
        if(Support.forPressure){
          this.setDown();
          // set touch event
          this.touch = this.selectTouch(event);//.touches[0];
          if(this.touch){
            this.fetchForce(event);
          }
        }
      }, false);
    }
  }

  end(){
    if(this.block.hasOwnProperty('end')){
      // call 'end' when the touch goes up
      this.el.addEventListener('touchend', () => {
        if(Support.forPressure){
          this.setUp();
          runClosure(this.block, 'end', this.el);
        }
      }, false);
    }
  }

  fetchForce(event){
    if(this.touchDown) {
      this.touch = this.selectTouch(event);
      setTimeout(this.fetchForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force, event);
    }
  }

  setDown(){
    this.touchDown = true;
  }

  setUp(){
    this.touchDown = false;
  }

  // link up the touch point to the correct element, this is to support multitouch
  selectTouch(event){
    if(event.touches.length === 1){
      return event.touches[0];
    }
    for(var i = 0; i < event.touches.length; i++){
      if(event.touches[i].target === this.el){
        console.log(event.touches[i].force);
        return event.touches[i];
      }
    }
  }

}
