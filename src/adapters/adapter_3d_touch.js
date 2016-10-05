/*
This adapter is more iOS devices running iOS 10 or higher and support 3D touch.
*/

class Adapter3DTouch extends BaseAdapter{

  constructor(element){
    super(element);
    if(supportsTouchForceChange){
      this.$start();
    } else {
      this.$start_legacy();
    }
    this.$end();
  }

  // Support check methods
  $start(){
    this.add('touchforcechange', (event) => {
      this.setPressed(true);
      this.runClosure('change', this.selectTouch(event).force, event);
    });
    this.add('touchstart', this.support.bind(this, 0));
  }

  support(iter, event){
    if(this.pressed === false && iter > 10){
      this.failOrPolyfill(event);
    } else if(this.pressed === false){
      setTimeout(this.support.bind(this), 10, iter++, event);
    } else {
      this.runClosure('start', event);
    }
  }

  $start_legacy(){
    this.add('touchstart', (event) => {
      this.forceValueTest = event.touches[0].force;
      this.support_legacy(0, event);
    });
  }

  support_legacy(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value
    // if the force value has changed it means the device supports pressure
    // more info from this issue https://github.com/yamartino/pressure/issues/15
    if(event.touches[0].force !== this.forceValueTest){
      this.started(event);
    } else if(iter <= 10) {
      setTimeout(this.support_legacy.bind(this), 10, iter++, event);
    } else{
      this.failOrPolyfill(event);
    }
  }

  started(event){
    this.setPressed(true);
    this.runClosure('start', event);
    this.runForce(event);
  }

  runForce(event){
    if(this.pressed) {
      this.setPressed(true);
      this.touch = this.selectTouch(event);
      setTimeout(this.runForce.bind(this), 10, event);
      this.runClosure('change', this.touch.force, event);
    }
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
