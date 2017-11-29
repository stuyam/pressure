$(function () {
  $('[data-toggle="popover"]').popover({trigger: 'manual'});
});

Pressure.set('.device-circle', {
  change: function(force){
    console.log(force);
    this.style.width = Pressure.map(force, 0, 1, 10, $(this).data('size')) + 'em';
    this.style.height = Pressure.map(force, 0, 1, 10, $(this).data('size')) + 'em';
    this.style.marginTop = '-' + Pressure.map(force, 0, 1, 10, $(this).data('size'))/2 + 'em';
    this.style.marginLeft = '-' + Pressure.map(force, 0, 1, 10, $(this).data('size'))/2 + 'em';
  },
  startDeepPress: function(){
    this.style.backgroundColor = '#5bc0de';
  },
  endDeepPress: function(){
    this.style.backgroundColor = '#d9534f';
  },
  end: function(){
    this.style.width = '10em';
    this.style.height = '10em';
    this.style.marginTop = '-5em';
    this.style.marginLeft = '-5em';
  }
}, {polyfillSpeedDown: 250});

Pressure.set('.device-circle', {
  change: function(){
    $('.pressure-failed').hide();
  },
  unsupported: function(){
    $('.pressure-failed').show();
  }
}, {polyfill: false});

var block = {

  change: function(force, event){
    this.style.width = ((200 * force) + 200) + 'px';
    this.innerHTML = force;
    this.style.backgroundColor = "rgb(" + parseInt(Pressure.map(force, 0, 1, 255, 0)) + ",100," + parseInt(Pressure.map(force, 0, 1, 0, 255)) +")";
    this.style.color = force > 0.3 ? 'white' : 'black';
  },

  end: function(){
    this.style.width = '200px';
    this.innerHTML = 0;
    this.style.backgroundColor = 'rgb(255,100,0)';
    this.style.color = 'black';
  },

  unsupported: function(){
    this.innerHTML = 'Sorry! Check the devices and browsers that Pressure works on above ^^^^';
  }
}

Pressure.set('#el1', block);
Pressure.set('#el2', block, {only: 'mouse'});
Pressure.set('#el3', block, {only: 'touch'});
Pressure.set('#el4', block, {only: 'pointer'});

Pressure.set('#pressure-test', {
  start: function(){
    this.innerHTML = 'Pressure is Supported!';
  },
  unsupported: function(){
    this.innerHTML = 'Pressure is NOT Supported!';
  }
});


Pressure.set('#peanuts', {
  change: function(force, event){
    this.style.webkitFilter = 'blur(' + Pressure.map(force, 0, 0.7, 20, 0) + 'px)';
  },

  end: function(){
    this.style.webkitFilter = 'blur(20px)';
  },

  unsupported: function(){
    this.innerHTML = 'Your device / browser does not support this :(';
  }
});

var saveForce = 0;
Pressure.set('#text-sizer', {
  change: function(force){
    if(force > saveForce){
      this.style.fontSize = Pressure.map(force, 0, 1, 16, 30);
      saveForce = force;
    }
  },

  end: function(){
    saveForce = 0;
  }
});

Pressure.set('#cube-btn', {
  change: function(force){
    document.getElementById('spinning-cube').style.webkitTransform = 'rotateZ(' + Pressure.map(force, 0, 1, 0, 360) + 'deg)';
  },
  end: function(){
    document.getElementById('spinning-cube').style.webkitTransform = 'rotateZ(0deg)';
  }
});

Pressure.set('#popover', {
  startDeepPress: function(force){
    $(this).popover('show');
  },
  endDeepPress: function(){
    $(this).popover('hide');
  }
});

// docs
Pressure.set('#output-element', {
  change: function(force, event){
    this.innerHTML = force;
  }
}, {polyfill: false});

Pressure.set('#element-touch', {
  change: function(force, event){
    this.innerHTML = force + 'on an iphone';
  }
}, {only: 'touch', polyfill: false});

Pressure.set('#element-mouse', {
  change: function(force, event){
    this.innerHTML = force + 'on a Mac';
  }
}, {only: 'mouse', polyfill: false});

Pressure.set('#element-pointer', {
  change: function(force, event){
    this.innerHTML = force + 'on a pointer device';
  }
}, {only: 'pointer', polyfill: false});

Pressure.set('#element-touch-prevent', {}, {only: 'touch', preventDefault: false});

Pressure.set('#element-mouse-prevent', {}, {only: 'mouse', preventDefault: false});

Pressure.set('#polyfill-example', {
  change: function(force, event){
    this.innerHTML = force;
  },
  end: function(){
    this.innerHTML = 0;
  },
  unsupported: function(){
    alert("Oh no, this device does not support pressure.")
  }
});

Pressure.set('#polyfill-speed-up', {
  change: function(force, event){
    this.innerHTML = force;
  },
  end: function(){
    this.innerHTML = 0;
  }
}, {polyfillSpeedUp: 5000});

Pressure.set('#polyfill-speed-down', {
  change: function(force, event){
    this.innerHTML = force;
  },
  end: function(){
    this.innerHTML = 0;
  }
}, {polyfillSpeedDown: 2000});

// Twitter BTN
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-72492481-1', 'auto');
ga('send', 'pageview');
