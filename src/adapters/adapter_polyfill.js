class AdapterPolyfill extends BaseAdapter{

  constructor(element, firstEvent){
    super(element);
    this.$start();
    this.$change();
    this.$end();
    this.force = 0;
    this.increment = 10/Config.get('polyfillSpeed', this.element.options);
    this.firstRun(firstEvent)
  }

  firstRun(event){
    this.startLogic(event);
    this.changeLogic(event);
  }

  $start(){
    // call 'start' when the touch goes down
    this.add(isMobile ? 'touchstart' : 'mousedown', (event) => {
      this.startLogic(event);
    });
  }

  startLogic(event){
    this.setPressed(true);
    this.runClosure('start', event);
  }

  $change(){
    this.add(isMobile ? 'touchstart' : 'mousedown', this.changeLogic.bind(this));
  }

  changeLogic(event){
    if(this.pressed){
      this.setPressed(true);
      this.runForce(event);
    }
  }

  $end(){
    // call 'end' when the mouse goes up or leaves the element
    this.add(isMobile ? 'touchend' : 'mouseup', () => {
      this.endDeepPress();
      this.setPressed(false);
      this.runClosure('end');
      this.force = 0;
    });
    this.add('mouseleave', () => {
      this.endDeepPress();
      if(this.pressed){
        this.runClosure('end');
      }
      this.setPressed(false);
      this.force = 0;
    });
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
