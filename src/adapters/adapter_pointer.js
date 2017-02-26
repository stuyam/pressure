/*
This adapter is for devices that support pointer events.
*/

class AdapterPointer extends Adapter{

  constructor(el, block, options){
    super(el, block, options);
  }

  bindEvents(){
    this.add('pointerdown', this.supportTest.bind(this, 0));
    this.add('pointermove', this.change.bind(this));
    this.add('pointerup', this._endPress.bind(this));
    this.add('pointerleave', this._endPress.bind(this));
  }

  supportTest(iter, event, runKey = this.runKey){
    if(this.isPressed() === false){
      if(iter <= 6){
        iter++;
        setTimeout(this.supportTest.bind(this, iter, event, runKey), 10);
      } else {
        this.fail(event, runKey);
      }
    }
  }

  change(event){
    if(this.isPressed() && event.pressure > 0){
      this._changePress(event.pressure, event);
      this.deepPress(event);
    }
  }

  deepPress(event){
    event.pressure >= 0.5 ? this._startDeepPress(event) : this._endDeepPress();
  }

}
