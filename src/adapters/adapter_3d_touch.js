/*
This adapter is more mobile devices that support 3D Touch.
*/

class Adapter3DTouch extends Adapter{

  constructor(el, block, options){
    super(el, block, options);
  }

  bindEvents(){
    if(supportsTouchForceChange){
      this.add('touchforcechange', this.start.bind(this));
      this.add('touchstart', this.support.bind(this, 0));
      this.add('touchend', this._endPress.bind(this));
    } else {
      this.add('touchstart', this.startLegacy.bind(this));
      this.add('touchend', this._endPress.bind(this));
    }
  }

  start(event){
    if(event.touches.length > 0){
      this._startPress(event);
      this.touch = this.selectTouch(event);
      if (this.touch) {
        this._changePress(this.touch.force, event);
      }
    }
  }

  support(iter, event, runKey = this.runKey){
    if(this.isPressed() === false){
      if(iter <= 6){
        iter++;
        setTimeout(this.support.bind(this, iter, event, runKey), 10);
      } else {
        this.fail(event, runKey);
      }
    }
  }

  startLegacy(event){
    this.initialForce = event.touches[0].force;
    this.supportLegacy(0, event, this.runKey, this.initialForce);
  }

  // this checks up to 6 times on a touch to see if the touch can read a force value
  // if the force value has changed it means the device supports pressure
  // more info from this issue https://github.com/yamartino/pressure/issues/15
  supportLegacy(iter, event, runKey, force){
    if(force !== this.initialForce){
      this._startPress(event);
      this.loopForce(event);
    } else if(iter <= 6) {
      iter++;
      setTimeout(this.supportLegacy.bind(this, iter, event, runKey, force), 10);
    } else{
      this.fail(event, runKey);
    }
  }

  loopForce(event){
    if(this.isPressed()) {
      this.touch = this.selectTouch(event);
      setTimeout(this.loopForce.bind(this, event), 10);
      this._changePress(this.touch.force, event);
    }
  }

  // link up the touch point to the correct element, this is to support multitouch
  selectTouch(event){
    if(event.touches.length === 1){
      return this.returnTouch(event.touches[0], event);
    } else {
      for(var i = 0; i < event.touches.length; i++){
        // if the target press is on this element
        if(event.touches[i].target === this.el || this.el.contains(event.touches[i].target)){
          return this.returnTouch(event.touches[i], event);
        }
      }
    }
  }

  // return the touch and run a start or end for deep press
  returnTouch(touch, event){
    this.deepPress(touch.force, event);
    return touch;
  }

}
