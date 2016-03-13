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
    this.style.width = $.pressureMap(force, 0, 1, 200, 300) + 'px';
    this.innerHTML = force;
    console.log('change', force);
  },

  startDeepPress: function(event){
    console.log('start deep press', event);
  },

  endDeepPress: function(){
    console.log('end deep press');
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

Pressure.set(document.querySelectorAll('#el1'), block, {polyfill: true});
Pressure.set($('#el2'), block, {only: 'force'});
Pressure.set('#el3', block, {only: '3d', polyfill: true});

$('#el1-jquery').pressure(block);
$('#el2-jquery').pressure(block, {only: 'force', preventDefault: false});
$('#el3-jquery').pressure(block, {only: '3d'});

// $('h3').pressure({
//   start: function(){
//     console.log('preventDefault text');
//   }
// }, {preventDefault: false});
