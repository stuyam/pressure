class TouchForce{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.state = 'up';
  }

  bindEvents(){
    this.start();

    this.change();

    this.end();

    this.preventDefaultForceTouch();
  }

  start(){
    if(this.block.hasOwnProperty('start')){
      // call 'start' when the mouse goes down
      this.el.addEventListener('mousedown', () => {
        if(Support.forPressure){
          this.setDown();
          runClosure(this.block, 'start', this.el);
        }
      }, false);
    }
  }

  change(){
    if(this.block.hasOwnProperty('change')){
      this.el.addEventListener('webkitmouseforcechanged', (event) => {
        if(Support.forPressure && event.webkitForce !== 0){
          runClosure(this.block, 'change', this.el, this.normalizeForce(event.webkitForce), event);
        }
      }, false);
    }
  }

  end(){
    if(this.block.hasOwnProperty('end')){
      // call 'end' when the mouse goes up or leaves the element
      this.el.addEventListener('mouseup', () => {
        if(Support.forPressure){
          this.setUp();
          runClosure(this.block, 'end', this.el);
        }
      }, false);
      this.el.addEventListener('mouseleave', () => {
        if(Support.forPressure){
          if(this.state === 'down'){
            runClosure(this.block, 'end', this.el);
          }
          this.setUp();
        }
      }, false);
    }
  }

  preventDefaultForceTouch(){
    // prevent the default force touch action for bound elements
    this.el.addEventListener('webkitmouseforcewillbegin', (event) => {
      if(Support.forPressure){
        event.preventDefault();
      }
    }, false);
  }

  setUp(){
    this.state = 'up';
  }

  setDown(){
    this.state = 'down';
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  normalizeForce(force){
    return (force - 1) / 2;
  }

}
