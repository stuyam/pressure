class Adapter3DTouch extends Adapter{

  constructor(element){
    super(element);
    this.$support();
    this.$start();
    this.$change();
    this.$end();
  }

  $support(){
    this.supportMethod = this.middleMan.bind(this);
    this.add('touchstart', this.supportMethod);
  }

  middleMan(event){
    this.setPressed(true);
    this.forceValueTest = event.touches[0].force;
    this.supportCallback(0, event);
  }

  supportCallback(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
    if(Support.hasRun === false && !(this.polyfill instanceof AdapterPolyfill)){
      // if the force value has changed it means the device supports pressure
      // more info from this issue https://github.com/yamartino/pressure/issues/15
      if(event.touches[0].force !== this.forceValueTest){
        this.preventDefault(event);
        Support.didSucceed('3d');
        this.remove('touchstart', this.supportMethod);
        runClosure(this.block, 'start', this.el, event);
        this.changeLogic(event);
      } else if(iter <= 10 && this.pressed) {
        iter += 1;
        setTimeout(this.supportCallback.bind(this), 10, iter, event);
      } else if(this.pressed){
        this.failOrPolyfill(event);
      }
    } else if(Support.forPressure || this.polyfill instanceof AdapterPolyfill){
      this.remove('touchstart', this.supportMethod);
    } else {
      this.failOrPolyfill(event);
    }
  }

  $start(){
    // call 'start' when the touch goes down
    this.add('touchstart', (event) => {
      if(Support.forPressure){
        this.setPressed(true);
        this.preventDefault(event);
        runClosure(this.block, 'start', this.el, event);
      }
    });
  }

  $change(){
    this.add('touchstart', this.changeLogic.bind(this));
  }

  changeLogic(event){
    if(Support.forPressure && this.pressed){
      this.setPressed(true);
      this.runForce(event);
    }
  }

  $end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(Support.forPressure){
        this.endDeepPress();
        this.setPressed(false);
        runClosure(this.block, 'end', this.el);
      }
    });
  }

  startDeepPress(event){
    if(this.deepPressed === false){
      runClosure(this.block, 'startDeepPress', this.el, event);
    }
    this.setDeepPressed(true);
  }

  endDeepPress(){
    if(this.deepPressed === true){
      runClosure(this.block, 'endDeepPress', this.el);
    }
    this.setDeepPressed(false);
  }

  runForce(event){
    if(this.pressed) {
      this.touch = this.selectTouch(event);
      setTimeout(this.runForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force, event);
    }
  }

  // link up the touch point to the correct element, this is to support multitouch
  selectTouch(event){
    if(event.touches.length === 1){
      return this.returnTouch(event.touches[0], event);
    } else {
      for(var i = 0; i < event.touches.length; i++){
        // if the target press is on this element
        if(event.touches[i].target === this.el){
          return this.returnTouch(event.touches[i], event);
        }
      }
    }
  }

  // return the touch and run a start or end for deep press
  returnTouch(touch, event){
    touch.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
    return touch;
  }

}
