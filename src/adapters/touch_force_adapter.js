class TouchForceAdapter{

  constructor(element){
    this.element = element;
    this.el = element.element;
    this.block = element.block;
    this.state = 'up';
    this._preventDefaultForceTouch();
  }

  // Support check methods
  support(){
    this.el.addEventListener('webkitmouseforcewillbegin', this._touchForceEnabled, false);
    this.el.addEventListener('mousedown', this._dispatch.bind(this), false);
  }

  _touchForceEnabled(event){
    event.preventDefault()
    Support.didSucceed('force');
  }

  _dispatch(){
    if(!Support.forPressure){
      Support.didFail();
      runClosure(this.block, 'unsupported', this.el);
    } else {
      this.el.removeEventListener('webkitmouseforcewillbegin', this._touchForceEnabled);
    }
  }

  // Start
  start(){
    // call 'start' when the mouse goes down
    this.el.addEventListener('mousedown', () => {
      if(Support.forPressure){
        this._setDown();
        runClosure(this.block, 'start', this.el);
      }
    }, false);
  }

  change(){
    this.el.addEventListener('webkitmouseforcechanged', (event) => {
      if(Support.forPressure && event.webkitForce !== 0){
        runClosure(this.block, 'change', this.el, this._normalizeForce(event.webkitForce), event);
      }
    }, false);
  }

  end(){
    // call 'end' when the mouse goes up or leaves the element
    this.el.addEventListener('mouseup', () => {
      if(Support.forPressure){
        this._setUp();
        runClosure(this.block, 'end', this.el);
      }
    }, false);
    this.el.addEventListener('mouseleave', () => {
      if(Support.forPressure){
        if(this.state === 'down'){
          runClosure(this.block, 'end', this.el);
        }
        this._setUp();
      }
    }, false);
  }

  _preventDefaultForceTouch(){
    // prevent the default force touch action for bound elements
    this.el.addEventListener('webkitmouseforcewillbegin', (event) => {
      if(Support.forPressure){
        event.preventDefault();
      }
    }, false);
  }

  _setUp(){
    this.state = 'up';
  }

  _setDown(){
    this.state = 'down';
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  _normalizeForce(force){
    return (force - 1) / 2;
  }

}
