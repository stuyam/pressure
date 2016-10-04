/*
This adapter is for Macs with Force Touch trackpads.
*/

class AdapterForceTouch extends BaseAdapter{

  constructor(element){
    super(element);
    this.$start();
    this.$change();
    this.$startDeepPress();
    this.$endDeepPress();
    this.$end();
  }

  // Support check methods
  $start(){
    this.add('webkitmouseforcewillbegin', this.startForce.bind(this));
    this.add('mousedown', this.support.bind(this));
  }

  startForce(event){
    this.setPressed(true);
    this.preventDefault(event);
    this.runClosure('start', event);
  }

  support(event){
    if(this.pressed === false){
      this.failOrPolyfill(event);
    }
  }

  $change(){
    this.add('webkitmouseforcechanged', (event) => {
      if(this.pressed && event.webkitForce !== 0){
        this.runClosure('change', this.normalizeForce(event.webkitForce), event);
      }
    });
  }

  $startDeepPress(){
    this.add('webkitmouseforcedown', (event) => {
      if(this.pressed){
        this.setDeepPressed(true);
        this.runClosure('startDeepPress', event);
      }
    });
  }

  $endDeepPress(){
    this.add('webkitmouseforceup', () => {
      if(this.pressed && this.deepPressed){
        this.setDeepPressed(false);
        this.runClosure('endDeepPress');
      }
    });
    this.add('mouseleave', () => {
      if(this.pressed && this.deepPressed){
        this.setDeepPressed(false);
        this.runClosure('endDeepPress');
      }
    });
  }

  $end(){
    // call 'end' when the mouse goes up or leaves the element
    this.add('mouseup', () => {
      if(this.pressed){
        this.setPressed(false);
        this.runClosure('end');
      }
    });
    this.add('mouseleave', () => {
      if(this.pressed){
        this.setPressed(false);
        this.runClosure('end');
      }
    });
  }

  // make the force the standard 0 to 1 scale and not the 1 to 3 scale
  normalizeForce(force){
    return this.reachOne(map(force, 1, 3, 0, 1));
  }

  // if the force value is above 0.999 set the force to 1
  reachOne(force){
    return force > 0.999 ? 1 : force;
  }

}
