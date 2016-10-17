/*
This adapter is more mobile devices that support 3D Touch.
*/

class Adapter3DTouch extends Adapter{

  constructor(element){
    super(element);
    this.bindEvents();
  }

  bindEvents(){
    if(supportsTouchForceChange){
      this.add('touchforcechange', this.start.bind(this));
      this.add('touchstart', this.support.bind(this, 0));
      this.add('touchend', this._endPress.bind(this));
    } else {
      this.add('touchstart', this.startLegacyPress.bind(this));
      this.add('touchend', this._endPress.bind(this));
    }
  }

  start(event){
    if(event.touches.length > 0){
      this._startPress(event);
      this.runClosure('change', this.selectTouch(event).force, event);
    }
  }

  support(iter, event){
    this.setPressed(true);
    if(this.nativeSupport === false){
      if(iter > 10){
        this.failOrPolyfill(event);
      } else {
        iter++;
        setTimeout(this.support.bind(this), 10, iter, event);
      }
    }
  }

  startLegacyPress(){
    this.setPressed(true);
    this.forceValueTest = event.touches[0].force;
    this.supportLegacyPress(0, event);
  }

  supportLegacyPress(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value
    // if the force value has changed it means the device supports pressure
    // more info from this issue https://github.com/yamartino/pressure/issues/15
    if(event.touches[0].force !== this.forceValueTest){
      this._startPress(event);
      this.loopForce(event);
    } else if(iter <= 10) {
      iter++
      setTimeout(this.supportLegacyPress.bind(this), 10, iter, event);
    } else{
      this.failOrPolyfill(event);
    }
  }

  loopForce(event){
    if(this.isPressed()) {
      this.touch = this.selectTouch(event);
      setTimeout(this.loopForce.bind(this, event), 10);
      this.runClosure('change', this.touch.force, event);
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
    touch.force >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
    return touch;
  }

}
