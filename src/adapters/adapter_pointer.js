/*
This adapter is for devices that support pointer events.
*/

class AdapterPointer extends Adapter{

  constructor(el, block, options){
    super(el, block, options);
  }

  bindEvents(){
    this.add('pointerdown', this.support.bind(this));
    this.add('pointermove', this.change.bind(this));
    this.add('pointerup', this._endPress.bind(this));
    this.add('pointerleave', this._endPress.bind(this));
  }

  support(event){
    if(this.isPressed() === false){
      if(event.pressure === 0 || event.pressure === 0.5 || event.pressure > 1){
        this.fail(event, this.runKey);
      } else {
        this._startPress(event);
        this._changePress(event.pressure, event);
      }
    }
  }

  change(event){
    if(this.isPressed() && event.pressure > 0 && event.pressure !== 0.5){
      this._changePress(event.pressure, event);
      this.deepPress(event.pressure, event);
    }
  }

}
