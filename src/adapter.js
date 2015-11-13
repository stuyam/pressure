class Adapter{

  constructor(adapter){
    this.adapter = adapter;
  }

  handle(){
    this.adapter.support();

    if(this.adapter.block.hasOwnProperty('start')){
      this.adapter.start();
    }

    if(this.adapter.block.hasOwnProperty('change')){
      this.adapter.change();
    }

    if(this.adapter.block.hasOwnProperty('end')){
      this.adapter.end();
    }

  }

}
