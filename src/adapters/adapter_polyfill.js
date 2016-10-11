/*
This adapter is for devices that don't have Force Touch or 3D Touch
support and have the 'polyfill' option turned on.
*/

class AdapterPolyfill extends Adapter{

  constructor(element){
    super(element);
    this.force = 0;
    this.increment = 10 / Config.get('polyfillSpeed', element.options);
  }

  runEvent(event){
    this.setPressed(true);
    this.runClosure('start', event);
    this.runForce(event);
    this.end();
  }

  end(){
    // call 'end' when the mouse goes up or leaves the element
    if(isMobile){
      this.add('touchend', this.endEvent.bind(this));
    } else {
      this.add('mouseup', this.endEvent.bind(this));
      this.add('mouseleave', this.endEvent.bind(this));
    }
  }

  endEvent(){
    if(this.pressed){
      this.endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
      this.force = 0;
    }
  }

  startDeepPress(event){
    if(this.deepPressed === false){
      this.runClosure('startDeepPress', event);
    }
    this.setDeepPressed(true);
  }

  endDeepPress(){
    if(this.deepPressed === true){
      this.runClosure('endDeepPress');
    }
    this.setDeepPressed(false);
  }

  runForce(event){
    if(this.pressed) {
      this.runClosure('change', this.force, event);
      this.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
      this.force = this.force + this.increment > 1 ? 1 : this.force + this.increment;
      setTimeout(this.runForce.bind(this), 10, event);
    }
  }

}
