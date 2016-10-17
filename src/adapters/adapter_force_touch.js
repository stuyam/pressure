/*
This adapter is for Macs with Force Touch trackpads.
*/

class AdapterForceTouch extends Adapter{

  constructor(element){
    super(element);
    this.bindEvents();
  }

  bindEvents(){
    this.add('webkitmouseforcewillbegin', this._startPress.bind(this));
    this.add('mousedown', this.support.bind(this));
    this.add('webkitmouseforcechanged', this.change.bind(this));
    this.add('webkitmouseforcedown', this._startDeepPress.bind(this));
    this.add('webkitmouseforceup', this._endDeepPress.bind(this));
    this.add('mouseleave', this._endPress.bind(this));
    this.add('mouseup', this._endPress.bind(this));
  }

  support(event){
    this.setPressed(true);
    if(this.nativeSupport === false){
      this.failOrPolyfill(event);
    }
  }

  change(event){
    if(this.isPressed() && event.webkitForce > 0){
      this.runClosure('change', this.normalizeForce(event.webkitForce), event);
    }
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  normalizeForce(force){
    return this.reachOne(map(force, 1, 3, 0, 1));
  }

  // if the force value is above 0.995 set the force to 1
  reachOne(force){
    return force > 0.995 ? 1 : force;
  }

}
