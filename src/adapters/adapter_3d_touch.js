/*
This adapter is more iOS devices running iOS 10 or higher and support 3D touch.
*/

class Adapter3DTouch extends BaseMobileAdapter{

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
    this.runClosure('change', this.selectTouch(event).force, event);
  }

  support(iter, event){
    if(this.pressed === false && iter > 10){
      this.failOrPolyfill(event);
    } else if(this.pressed === false){
      iter += 1;
      setTimeout(this.support.bind(this), 10, iter, event);
    } else {
      this.runClosure('start', event);
    }
  }

}
