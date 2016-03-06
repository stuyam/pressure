class AdapterShim extends Adapter{

  constructor(element, firstEvent){
    super(element);
    this.$start();
    this.$change();
    this.$end();
    this.force = 0;
    this.increment = 0.01;
    this.firstRun(firstEvent)
  }

  firstRun(event){
    this.preventDefaultShim(event);
    this.startLogic(event);
    this.changeLogic(event);
  }

  $start(){
    // call 'start' when the touch goes down
    this.add(Support.mobile ? 'touchstart' : 'mousedown', (event) => {
      this.startLogic(event);
    });
  }

  startLogic(event){
    this.setPressed(true);
    runClosure(this.block, 'start', this.el, event);
  }

  $change(){
    this.add(Support.mobile ? 'touchstart' : 'mousedown', this.changeLogic.bind(this));
  }

  changeLogic(event){
    if(this.pressed){
      this.setPressed(true);
      this.runForce(event);
    }
  }

  $end(){
    // call 'end' when the mouse goes up or leaves the element
    this.add(Support.mobile ? 'touchend' : 'mouseup', () => {
      this.endDeepPress();
      this.setPressed(false);
      runClosure(this.block, 'end', this.el);
      this.force = 0;
    });
    this.add('mouseleave', () => {
      this.endDeepPress();
      if(this.pressed){
        runClosure(this.block, 'end', this.el);
      }
      this.setPressed(false);
      this.force = 0;
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

  runForce(event){
    if(this.pressed) {
      runClosure(this.block, 'change', this.el, this.force, event);
      this.force >= 0.5 ? this.startDeepPress(event) : this.endDeepPress();
      this.force = this.force + this.increment > 1 ? 1 : this.force + this.increment;
      setTimeout(this.runForce.bind(this), 10, event);
    }
  }

  // prevent the default action of text selection is all browsers
  preventDefaultShim(event){
    if(this.element.options.hasOwnProperty('preventDefault') === false || this.element.options.preventDefault !== false){
      event.preventDefault();
      this.el.style.webkitTouchCallout = "none";
      this.el.style.userSelect = "none";
      this.el.style.webkitUserSelect = "none";
      this.el.style.MozUserSelect = "none";
    }
  }

}
