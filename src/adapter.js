class Adapter{

  constructor(adapter){
    this.adapter = adapter;
  }

  handle(){
    this.adapter.support();

    this.adapter.start();
    this.adapter.change();
    this.adapter.end();
    this.adapter.startDeepPress();
    this.adapter.endDeepPress();
  }

}
