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
          this.touch = event.touches[0];
          if(this.touch){
            this.fetchForce(event);
          }
          // runClosure(this.block, 'change', this.el);
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
      this.touch = event.touches[0];
      setTimeout(this.fetchForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force || 0, event);
    }
  }

  setDown(){
    this.touchDown = true;
  }

  setUp(){
    this.touchDown = false;
  }

}
