class Touch3D{

  constructor(el){
    this.el = el;
    this.touchDown = false;
  }

  bindEvents(){
    this.start();

    this.change();

    this.end();
  }

  start(){
    if(el.element.hasOwnProperty('start')){
      // call 'start' when the touch goes down
      el.element.addEventListener('touchstart', function(){
        runClosure(el.element.block, 'start');
      }, false);
    }
  }

  change(){
    if(el.element.block.hasOwnProperty('change')){
      el.element.addEventListener('touchstart', function(event){
        this.down();
        // set touch event
        this.touch = event.touches[0];
        if(this.touch){
          this.fetchForce(event);
        }
        runClosure(el.element.block, 'start');
      }, false);
    }
  }

  end(){
    if(el.element.hasOwnProperty('end')){
      // call 'end' when the touch goes up
      el.element.addEventListener('touchend', function(){
        this.touchDown = false;
        runClosure(el.element.block, 'end');
      }, false);
    }
  }

  fetchForce(event){
    if(this.touchDown) {
      this.touch = event.touches[0];
      setTimeout(this.fetchForce.bind(this), 10, event);
      runClosure(el.element.block, 'change', this.touch.force || 0, event);
    }
  }

}
