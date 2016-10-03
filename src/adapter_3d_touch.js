/*
This adapter is more iOS devices running iOS 10 or higher and support 3D touch.
*/

class Adapter3DTouch extends Adapter{

  constructor(element){
    super(element);
    this.$start();
    this.$end();
  }

  // Support check methods
  $start(){
    this.add('touchforcechange', this.startForce.bind(this));
    this.add('touchstart', this.support.bind(this, 0));
  }

  startForce(event){
    this.setPressed(true);
    this.preventDefault(event);
    runClosure(this.block, 'change', this.el, this.selectTouch(event).force, event);
  }

  support(iter, event){
    if(this.pressed === false && iter > 10){
      this.failOrPolyfill(event);
    } else if(this.pressed === false){
      iter += 1;
      setTimeout(this.support.bind(this), 10, iter, event);
    } else {
      runClosure(this.block, 'start', this.el, event);
    }
  }

  $end(){
    // call 'end' when the touch goes up
    this.add('touchend', () => {
      if(this.pressed){
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
