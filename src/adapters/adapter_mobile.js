/*
This adapter is more iOS devices running iOS 9 or lower and support 3D Touch
This also conforms to the W3C spec fo any future devices will support force
sensitive screans.
*/

class AdapterMobile extends BaseMobileAdapter{

  constructor(element){
    super(element);
    this.$start();
    this.$end();
  }

  $start(){
    this.add('touchstart', (event) => {
      this.forceValueTest = event.touches[0].force;
      this.support(0, event);
    });
  }

  support(iter, event){
    // this checks up to 10 times on a touch to see if the touch can read a force value or not to check "support"
    if(this.pressed === false){
      // if the force value has changed it means the device supports pressure
      // more info from this issue https://github.com/yamartino/pressure/issues/15
      if(event.touches[0].force !== this.forceValueTest){
        this.started(event);
      } else if(iter <= 10 && this.pressed) {
        setTimeout(this.supportCallback.bind(this), 10, iter++, event);
      } else if(this.pressed){
        this.failOrPolyfill(event);
      }
    } else {
      this.started(event);
    }
  }

  started(this){
    this.setPressed(true);
    this.preventDefault(event);
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

}
