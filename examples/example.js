// Example of change method with a failure closure
// This structure can be used in any methods of Pressure
// The failure block will return with an "error" and message showing why the device doesn't support 3D Touch and Force Touch

Pressure.config({
  polyfill: true
});

$.pressureConfig({
  preventDefault: false
});

var block = {
  start: function(event){
    console.log('start', event);
  },

  change: function(force, event){
    this.style.width = Pressure.map(force, 0, 1, 200, 300) + 'px';
    this.innerHTML = force;
    console.log('change', force);
  },

  startDeepPress: function(event){
    console.log('start deep press', event);
    this.style.backgroundColor = '#FF0040';
  },

  endDeepPress: function(){
    console.log('end deep press');
    this.style.backgroundColor = '#0080FF';
  },

  end: function(){
    console.log('end');
    this.style.width = '200px';
    this.innerHTML = 0;
  },

  unsupported: function(){
    console.log(this);
    this.innerHTML = 'Your device / browser does not support this :(';
  }
}

Pressure.set(document.querySelectorAll('#el1'), block);
Pressure.set($('#el2'), block, {only: 'desktop', polyfill: true, polyfillSpeed: 5000});
Pressure.set('#el3', block, {only: 'mobile'});

$('#el1-jquery').pressure(block);
$('#el2-jquery').pressure(block, {only: 'desktop', preventDefault: false});
$('#el3-jquery').pressure(block, {only: 'mobile'});
