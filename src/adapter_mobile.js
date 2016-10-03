/*
This adapter is more iOS devices running iOS 9 or lower and support 3D Touch
This also conforms to the W3C spec fo any future devices will support force
sensitive screans.
*/

class AdapterMobile extends Adapter{

  constructor(element){
    super(element);
    this.$start();
    this.$change();
    this.$end();
  }

  $start(){
    this.add('touchstart', this.passToSupport.bind(this));
  }

  passToSupport(event){
    this.setPressed(true);
    this.forceValueTest = event.touches[0].force;
    this.supportCallback(0, event);
  }

  support(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
    if(this.pressed === false){
      // if the force value has changed it means the device supports pressure
      // more info from this issue https://github.com/yamartino/pressure/issues/15
      if(event.touches[0].force !== this.forceValueTest){
        this.preventDefault(event);
        this.setPressed(true);
        runClosure(this.block, 'start', this.el, event);
        this.changeLogic(event);
      } else if(iter <= 10 && this.pressed) {
        iter += 1;
        setTimeout(this.supportCallback.bind(this), 10, iter, event);
      } else if(this.pressed){
        this.failOrPolyfill(event);
      }
    } else {
      this.preventDefault(event);
      this.setPressed(true);
      runClosure(this.block, 'start', this.el, event);
      this.changeLogic(event);
    }
  }

  $change(){
    this.add('touchstart', this.changeLogic.bind(this));
  }

  changeLogic(event){
    if(this.pressed){
      this.setPressed(true);
      this.runForce(event);
    }
  }

  runForce(event){
    if(this.pressed) {
      this.touch = this.selectTouch(event);
      setTimeout(this.runForce.bind(this), 10, event);
      runClosure(this.block, 'change', this.el, this.touch.force, event);
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
