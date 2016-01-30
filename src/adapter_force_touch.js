class AdapterForceTouch extends Adapter{

  constructor(element){
    super(element);
    this.$support();
    this.$start();
    this.$change();
    this.$end();
    this.$startDeepPress();
    this.$endDeepPress();
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

  supportCallback(){
    if(Support.forPressure === false){
      Support.didFail();
      runClosure(this.block, 'unsupported', this.el);
    } else {
      this.remove('webkitmouseforcewillbegin', this.forceTouchEnabled);
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
      if(Support.forPressure && event.webkitForce !== 0){
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
    this.add('webkitmouseforceup', (event) => {
      if(Support.forPressure){
        this.setDeepPressed(false);
        runClosure(this.block, 'endDeepPress', this.el, event);
      }
    });
    this.add('mouseleave', (event) => {
      if(Support.forPressure){
        if(this.deepPressed){
          runClosure(this.block, 'endDeepPress', this.el, event);
        }
        this.setDeepPressed(false);
      }
    });
  }

  preventDefaultForceTouch(){
    // prevent the default force touch action for bound elements
    this.add('webkitmouseforcewillbegin', (event) => {
      if(Support.forPressure){
        if(!this.element.options.hasOwnProperty('preventDefault') || this.element.options.preventDefault !== false){
          event.preventDefault();
        }
      }
    });
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  normalizeForce(force){
    return map(force, 1, 3, 0, 1);
  }

}
