class Touch3DAdapter extends BaseAdapter{

  constructor(element){
    super(element);
    this._startDeepPressSetEnabled = false;
    this._endDeepPressSetEnabled = false;
    this._inDeepPress = false;
  }

  support(){
    this.add('touchstart', this._dispatch.bind(this));
  }

  _dispatch(event){
    if(event.touches[0].force !== undefined){
      // can't check full support from this info
      Support.didSucceed('3d');
      this.remove('touchstart', this._dispatch.bind(this));
    } else {
      Support.didFail();
      runClosure(this.block, 'unsupported', this.el);
    }
  }

  start(){
    // call 'start' when the touch goes down
    this.add('touchstart', () => {
      if(Support.forPressure){
        runClosure(this.block, 'start', this.el);
      }
    });
  }

  change(){
    this.add('touchstart', (event) =>{
      if(Support.forPressure){
        this._setDown();
        // set touch event
        this.touch = this._selectTouch(event);
        if(this.touch){
          this._fetchForce(event);
        }
      }
    });
  }

  end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(Support.forPressure){
        this._setUp();
        runClosure(this.block, 'end', this.el);
      }
    });
  }

  startDeepPress(){
    this._startDeepPressSetEnabled = true;
    // the logic for this runs in the '_callStartDeepPress' method
  }

  endDeepPress(){
    this._endDeepPressSetEnabled = true;
    // the logic for this runs in the '_callEndDeepPress' method
  }

  _callStartDeepPress(){
    if(this._startDeepPressSetEnabled === true){
      if(this._inDeepPress === false){
        runClosure(this.block, 'startDeepPress', this.el);
      } else {
        this._inDeepPress = true;
      }
    }
  }

  _callEndDeepPress(){
    if(this._endDeepPressSetEnabled === true){
      if(this._inDeepPress === true){
        runClosure(this.block, 'endDeepPress', this.el);
      } else {
        this._inDeepPress = false;
      }
    }
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
      return event.touches[0];
    }
    for(var i = 0; i < event.touches.length; i++){
      if(event.touches[i].target === this.el){
        // console.log(event.touches[i].force);
        event.touches[i] >= 0.5 ? this._callStartDeepPress() : this._callEndDeepPress();
        return event.touches[i];
      }
    }
  }

}
