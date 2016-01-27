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
    this.supportCallback(0, event);
  }

  supportCallback(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
    if(Support.hasRun === false){
      if(event.touches[0].force > 0){
        Support.didSucceed('3d');
        this.remove('touchstart', this.supportMethod);
        runClosure(this.block, 'start', this.el);
        this.changeLogic(event);
      } else if(iter <= 10 && this.pressed === true) {
        iter += 1;
        setTimeout(this.supportCallback.bind(this), 10, iter, event);
      } else if(this.pressed === true){
        Support.didFail();
        runClosure(this.block, 'unsupported', this.el);
      }
    } else if(Support.forPressure){
      this.remove('touchstart', this.supportMethod);
    } else {
      runClosure(this.block, 'unsupported', this.el);
    }
  }

  $start(){
    // call 'start' when the touch goes down
    this.add('touchstart', () => {
      if(Support.forPressure){
        this.setPressed(true);
        runClosure(this.block, 'start', this.el);
      }
    });
  }

  $change(){
    this.add('touchstart', this.changeLogic.bind(this));
  }

  changeLogic(event){
    if(Support.forPressure){
      this.setPressed(true);
      // set touch event
      this.touch = this.selectTouch(event);
      if(this.touch){
        this.fetchForce(event);
      }
    }
  }

  $end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(Support.forPressure){
        this.setPressed(false);
        runClosure(this.block, 'end', this.el);
        this.endDeepPress();
      }
    });
  }

  startDeepPress(){
    if(this.deepPressed === false){
      runClosure(this.block, 'startDeepPress', this.el);
    }
    this.setDeepPressed(true);
  }

  endDeepPress(){
    if(this.deepPressed === true){
      runClosure(this.block, 'endDeepPress', this.el);
    }
    this.setDeepPressed(false);
  }

  fetchForce(event){
    if(this.pressed) {
      this.touch = this.selectTouch(event);
      setTimeout(this.fetchForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force, event);
    }
  }

  // link up the touch point to the correct element, this is to support multitouch
  selectTouch(event){
    if(event.touches.length === 1){
      return this.returnTouch(event.touches[0].force);
    } else {
      for(var i = 0; i < event.touches.length; i++){
        // if the target press is on this element
        if(event.touches[i].target === this.el){
          return this.returnTouch(event.touches[i]);
        }
      }
    }
  }

  // return the touch and run a start or end for deep press
  returnTouch(touch){
    touch.force >= 0.5 ? this.startDeepPress() : this.endDeepPress();
    return touch;
  }

}
