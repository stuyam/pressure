class Adapter3DTouch extends Adapter{

  constructor(element){
    super(element);
    this.support();
    this.start();
    this.change();
    this.end();
  }

  support(){
    this.supportMethod = this._middleMan.bind(this);
    this.add('touchstart', this.supportMethod);
  }

  _middleMan(event){
    this._setDown();
    this._dispatch(0, event);
  }

  _dispatch(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
    if(Support.hasRun === false){
      if(event.touches[0].force > 0){
        Support.didSucceed('3d');
        this.remove('touchstart', this.supportMethod);
        runClosure(this.block, 'start', this.el);
        this._changeLogic(event);
      } else if(iter <= 10 && this.down === true) {
        iter += 1;
        setTimeout(this._dispatch.bind(this), 10, iter, event);
      } else if(this.down === true){
        Support.didFail();
        runClosure(this.block, 'unsupported', this.el);
      }
    } else if(Support.forPressure){
      this.remove('touchstart', this.supportMethod);
    } else {
      runClosure(this.block, 'unsupported', this.el);
    }
  }

  start(){
    // call 'start' when the touch goes down
    this.add('touchstart', () => {
      if(Support.forPressure){
        this._setDown();
        runClosure(this.block, 'start', this.el);
      }
    });
  }

  change(){
    this.add('touchstart', this._changeLogic.bind(this));
  }

  _changeLogic(event){
    if(Support.forPressure){
      this._setDown();
      // set touch event
      this.touch = this._selectTouch(event);
      if(this.touch){
        this._fetchForce(event);
      }
    }
  }

  end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(Support.forPressure){
        this._setUp();
        runClosure(this.block, 'end', this.el);
        this.endDeepPress();
      }
    });
  }

  startDeepPress(){
    if(this.deepDown === false){
      runClosure(this.block, 'startDeepPress', this.el);
    }
    this._setDeepDown();
  }

  endDeepPress(){
    if(this.deepDown === true){
      runClosure(this.block, 'endDeepPress', this.el);
    }
    this._setDeepUp();
  }

  _fetchForce(event){
    if(this.down) {
      this.touch = this._selectTouch(event);
      setTimeout(this._fetchForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force, event);
    }
  }

  // link up the touch point to the correct element, this is to support multitouch
  _selectTouch(event){
    if(event.touches.length === 1){
      return this._returnTouch(event.touches[0].force);
    } else {
      for(var i = 0; i < event.touches.length; i++){
        // if the target press is on this element
        if(event.touches[i].target === this.el){
          return this._returnTouch(event.touches[i]);
        }
      }
    }
  }

  // return the touch and run a start or end for deep press
  _returnTouch(touch){
    touch.force >= 0.5 ? this.startDeepPress() : this.endDeepPress();
    return touch;
  }

}
