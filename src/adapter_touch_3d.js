class AdapterTouch3D extends Adapter{

  constructor(element){
    super(element);
    this.startDeepPressSetEnabled = false;
    this.endDeepPressSetEnabled = false;
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
        if(this.deepDown === true){
          runClosure(this.block, 'endDeepPress', this.el);
          this._setDeepUp();
        }
      }
    });
  }

  startDeepPress(){
    this.startDeepPressSetEnabled = true;
    // the logic for this runs in the '_callStartDeepPress' method
  }

  endDeepPress(){
    this.endDeepPressSetEnabled = true;
    // the logic for this runs in the '_callEndDeepPress' method
  }

  _callStartDeepPress(){
    if(this.startDeepPressSetEnabled === true && this.deepDown === false){
      runClosure(this.block, 'startDeepPress', this.el);
    }
    this._setDeepDown();
  }

  _callEndDeepPress(){
    if(this.endDeepPressSetEnabled === true && this.deepDown === true){
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
      event.touches[0].force >= 0.5 ? this._callStartDeepPress() : this._callEndDeepPress();
      return event.touches[0];
    }
    for(var i = 0; i < event.touches.length; i++){
      if(event.touches[i].target === this.el){
        // console.log(event.touches[i].force);
        event.touches[i].force >= 0.5 ? this._callStartDeepPress() : this._callEndDeepPress();
        return event.touches[i];
      }
    }
  }

}
