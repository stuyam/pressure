class AdapterTouchForce extends Adapter{

  constructor(element){
    super(element);
    this._preventDefaultForceTouch();
  }

  // Support check methods
  support(){
    this.add('webkitmouseforcewillbegin', this._touchForceEnabled);
    this.add('mousedown', this._dispatch.bind(this));
  }

  _touchForceEnabled(event){
    event.preventDefault()
    Support.didSucceed('force');
  }

  _dispatch(){
    if(Support.forPressure === false){
      Support.didFail();
      runClosure(this.block, 'unsupported', this.el);
    } else {
      this.remove('webkitmouseforcewillbegin', this._touchForceEnabled);
    }
  }

  start(){
    // call 'start' when the mouse goes down
    this.add('mousedown', () => {
      if(Support.forPressure){
        this._setDown();
        runClosure(this.block, 'start', this.el);
      }
    });
  }

  change(){
    this.add('webkitmouseforcechanged', (event) => {
      if(Support.forPressure && event.webkitForce !== 0){
        runClosure(this.block, 'change', this.el, this._normalizeForce(event.webkitForce), event);
      }
    });
  }

  end(){
    // call 'end' when the mouse goes up or leaves the element
    this.add('mouseup', () => {
      if(Support.forPressure){
        this._setUp();
        runClosure(this.block, 'end', this.el);
      }
    });
    this.add('mouseleave', () => {
      if(Support.forPressure){
        if(this.down === true){
          runClosure(this.block, 'end', this.el);
          runClosure(this.block, 'endDeepPress', this.el);
        }
        this._setUp();
      }
    });
  }

  startDeepPress(){
    this.add('webkitmouseforcedown', () => {
      if(Support.forPressure){
        this._setDeepDown();
        runClosure(this.block, 'startDeepPress', this.el);
      }
    });
  }

  endDeepPress(){
    this.add('webkitmouseforceup', () => {
      if(Support.forPressure){
        this._setDeepUp();
        runClosure(this.block, 'endDeepPress', this.el);
      }
    });
  }

  _preventDefaultForceTouch(){
    // prevent the default force touch action for bound elements
    this.add('webkitmouseforcewillbegin', (event) => {
      if(Support.forPressure){
        event.preventDefault();
      }
    });
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  _normalizeForce(force){
    return (force - 1) / 2;
  }

}
