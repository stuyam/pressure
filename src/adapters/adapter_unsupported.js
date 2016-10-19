/*
This adapter is called when an unsupported device is being triggered
*/

class AdapterUnsupported extends Adapter{

  constructor(el){
    super(el);
  }

  bindEvents(){
    this.add(isMobile ? 'touchstart' : 'mousedown', (event) => this.runClosure('unsupported', event));
  }

}
