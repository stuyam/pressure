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
}, {polyfill: true});

Pressure.set('.device-circle', {
  unsupported: function(){
    $('.pressure-failed').show();
  }
});

var block = {
  start: function(){
  },

  change: function(force, event){
    this.style.width = ((200 * force) + 200) + 'px';
    this.innerHTML = force;
    this.style.backgroundColor = "rgb(" + parseInt(Pressure.map(force, 0, 1, 255, 0)) + ",200," + parseInt(Pressure.map(force, 0, 1, 0, 255)) +")";
    this.style.color = force > 0.4 ? 'white' : 'black';
  },

  end: function(){
    this.style.width = '200px';
    this.innerHTML = 0;
    this.style.backgroundColor = '#FFC800';
    this.style.color = 'black';
  },

  unsupported: function(){
    this.innerHTML = 'Sorry! Check the devices and browsers that Pressure works on above ^^^^';
  }
}

Pressure.set('#el1', block, {polyfill: true});
Pressure.set('#el2', block, {only: 'force', polyfill: true});
Pressure.set('#el3', block, {only: '3d', polyfill: true});

Pressure.set('#pressure-test', {
  start: function(){
    this.innerHTML = 'Pressure is Supported!';
  },
  unsupported: function(){
    this.innerHTML = 'Pressure is NOT Supported!';
  }
}, {polyfill: false});


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
}, {polyfill: true});

Pressure.set('#text-sizer', {
  change: function(force){
    this.style.fontSize = Pressure.map(force, 0, 1, 16, 30);
  },
  end: function(){
    this.style.fontSize = 16;
  }
}, {polyfill: true});

Pressure.set('#cube-btn', {
  change: function(force){
    document.getElementById('spinning-cube').style.webkitTransform = 'rotateZ(' + Pressure.map(force, 0, 1, 0, 360) + 'deg)';
  },
  end: function(){
    document.getElementById('spinning-cube').style.webkitTransform = 'rotateZ(0deg)';
  }
}, {polyfill: true});

Pressure.set('#popover', {
  startDeepPress: function(force){
    $(this).popover('show');
  },
  endDeepPress: function(){
    $(this).popover('hide');
  }
}, {polyfill: true});

// docs
Pressure.set('#output-element', {
  change: function(force, event){
    this.innerHTML = force;
  }
});

Pressure.set('#element-3d', {
  change: function(force, event){
    this.innerHTML = force + 'on an iphone';
  }
}, {only: '3d'});

Pressure.set('#element-force', {
  change: function(force, event){
    this.innerHTML = force + 'on a Mac';
  }
}, {only: 'force'});

Pressure.set('#element-3d-prevent', {}, {only: '3d', preventDefault: false});

Pressure.set('#element-force-prevent', {}, {only: 'force', preventDefault: false});

Pressure.set('#polyfill-example', {
  change: function(force, event){
    this.innerHTML = force;
  },
  end: function(){
    this.innerHTML = 0;
  }
}, {polyfill: true});

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
