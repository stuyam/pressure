function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var block = {
  start: function(){
  },

  change: function(force, event){
    this.style.width = ((200 * force) + 200) + 'px';
    this.innerHTML = force;
    this.style.backgroundColor = "rgb(" + parseInt(map(force, 0, 1, 255, 0)) + ",200," + parseInt(map(force, 0, 1, 0, 255)) +")";
    this.style.color = force > 0.4 ? 'white' : 'black';
  },

  end: function(){
    this.style.width = '200px';
    this.innerHTML = 0;
    this.style.backgroundColor = '#FFC800';
    this.style.color = 'black';
  },

  unsupported: function(){
    this.innerHTML = 'Your device / browser does not support this :(';
  }
}

Pressure.set('#el1', block);
Pressure.setForceTouch('#el2', block);
Pressure.set3DTouch('#el3', block);


Pressure.set('#peanuts', {
  change: function(force, event){
    this.style.webkitFilter = 'blur(' + map(force, 0, 0.7, 20, 0) + 'px)';
  },

  end: function(){
    this.style.webkitFilter = 'blur(20px)';
  },

  unsupported: function(){
    this.innerHTML = 'Your device / browser does not support this :(';
  }
});

Pressure.set('#text-sizer', {
  change: function(force){
    this.style.fontSize = Pressure.map(force, 0, 1, 16, 24);
  },
  end: function(){
    this.style.fontSize = 16;
  }
});

Pressure.set('#spinning-cube', {
  change: function(force){
    this.style.webkitTransform = 'rotateZ(' + Pressure.map(force, 0, 1, 0, 360) + 'deg)';
  },
  end: function(){
    this.style.webkitTransform = 'rotateZ(0deg)';
  }
});

// docs
Pressure.set('#output-element', {
  change: function(force, event){
    this.innerHTML = force;
  }
});

Pressure.set3DTouch('#element-3d', {
  change: function(force, event){
    this.innerHTML = force + 'on an iphone';
  }
});

Pressure.setForceTouch('#element-force', {
  change: function(force, event){
    this.innerHTML = force + 'on a Mac';
  }
});
