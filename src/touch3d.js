// 3D Touch function constructor
function Touch3D(){
  this.touchDown = false;
}

// the user is touching
Touch3D.prototype.down = function(){
  this.touchDown = true;
}

// the user is NOT touching
Touch3D.prototype.up = function(){
  this.touchDown = false;
}

// initialize the checking of the force pressure
Touch3D.prototype.startCheckingForce = function(event, closure, element) {
  this.element = element;
  this.down();
  console.log(event);
  // set touch event
  this.touch = event.touches[0];
  if(this.touch){
    this.fetchForce(event, closure);
  }
}

// if this.touchDown is still set to true, setTimeout to call itself ver and over again
Touch3D.prototype.fetchForce = function(event, closure) {
  if(this.touchDown) {
    this.touch = event.touches[0];
    setTimeout(this.fetchForce.bind(this), 10, event, closure);
    closure.call(this.element, this.touch.force || 0, event);
  }
}
