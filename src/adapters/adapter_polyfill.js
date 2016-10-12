/*
This adapter is for devices that don't have Force Touch or 3D Touch
support and have the 'polyfill' option turned on.
*/

class AdapterPolyfill extends Adapter{

  constructor(element){
    super(element, 0);
    this.increment = 10 / Config.get('polyfillSpeed', element.options);
    this.force = 0;
  }

  runEvent(event){
    this._startPress(event);
    this.loopForce(event);
  }

  loopForce(event){
    if(this.isPressed()) {
      this.runClosure('change', this.force, event);
      this.force >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
      this.force = this.force + this.increment > 1 ? 1 : this.force + this.increment;
      setTimeout(this.loopForce.bind(this), 10, event);
    }
  }

}
