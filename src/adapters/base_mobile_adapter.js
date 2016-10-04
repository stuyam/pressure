class BaseMobileAdapter extends BaseAdapter{

  constructor(element){
    super(element);
  }

  $end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(this.pressed){
        this.endDeepPress();
        this.setPressed(false);
        this.runClosure('end');
      }
    });
  }

  startDeepPress(event){
    if(this.deepPressed === false){
      this.runClosure('startDeepPress', event);
    }
    this.setDeepPressed(true);
  }

  endDeepPress(){
    if(this.deepPressed === true){
      this.runClosure('endDeepPress');
    }
    this.setDeepPressed(false);
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
