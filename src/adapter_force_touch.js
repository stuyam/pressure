class AdapterForceTouch extends Adapter{

  constructor(element){
    super(element);
    this.$support();
    this.$start();
    this.$change();
    this.$startDeepPress();
    this.$endDeepPress();
    this.$end();
    this.preventDefaultForceTouch();
  }

  // Support check methods
  $support(){
    this.add('webkitmouseforcewillbegin', this.forceTouchEnabled);
    this.add('mousedown', this.supportCallback.bind(this));
  }

  forceTouchEnabled(event){
    event.preventDefault()
    Support.didSucceed('force');
  }

  supportCallback(event){
    if(Support.forPressure === true || this.shim instanceof AdapterShim){
      this.remove('webkitmouseforcewillbegin', this.forceTouchEnabled);
    } else {
       Support.didFail();
      // is the shim option set
      if(this.element.options.hasOwnProperty('shim') && this.element.options.shim == true){
        this.shim = new AdapterShim(this.element, event);
      } else {
        runClosure(this.block, 'unsupported', this.el);
      }
    }
  }

  $start(){
    // call 'start' when the mouse goes down
    this.add('mousedown', (event) => {
      if(Support.forPressure){
        this.setPressed(true);
        runClosure(this.block, 'start', this.el, event);
      }
    });
  }

  $change(){
    this.add('webkitmouseforcechanged', (event) => {
      if(Support.forPressure && event.webkitForce !== 0 && this.pressed){
        runClosure(this.block, 'change', this.el, this.normalizeForce(event.webkitForce), event);
      }
    });
  }

  $end(){
    // call 'end' when the mouse goes up or leaves the element
    this.add('mouseup', () => {
      if(Support.forPressure){
        this.setPressed(false);
        runClosure(this.block, 'end', this.el);
      }
    });
    this.add('mouseleave', () => {
      if(Support.forPressure){
        if(this.pressed){
          runClosure(this.block, 'end', this.el);
        }
        this.setPressed(false);
      }
    });
  }

  $startDeepPress(){
    this.add('webkitmouseforcedown', (event) => {
      if(Support.forPressure){
        this.setDeepPressed(true);
        runClosure(this.block, 'startDeepPress', this.el, event);
      }
    });
  }

  $endDeepPress(){
    this.add('webkitmouseforceup', () => {
      if(Support.forPressure){
        this.setDeepPressed(false);
        runClosure(this.block, 'endDeepPress', this.el);
      }
    });
    this.add('mouseleave', () => {
      if(Support.forPressure){
        if(this.deepPressed){
          runClosure(this.block, 'endDeepPress', this.el);
        }
        this.setDeepPressed(false);
      }
    });
  }

  preventDefaultForceTouch(){
    // prevent the default force touch action for bound elements
    this.add('webkitmouseforcewillbegin', (event) => {
      if(Support.forPressure){
        if(this.element.options.hasOwnProperty('preventDefault') === false || this.element.options.preventDefault !== false){
          event.preventDefault();
          this.el.style.webkitUserSelect = "none";
        }
      }
    });
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  normalizeForce(force){
    return map(force, 1, 3, 0, 1);
  }

}
