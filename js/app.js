console.log(window.location.href);

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

$(function () {
  $('[data-toggle="popover"]').popover({trigger: 'manual'});
});

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
    this.innerHTML = 'Sorry! Check the devices and browsers that Pressure works on above ^^^^';
  }
}

Pressure.set('#el1', block);
Pressure.setForceTouch('#el2', block);
Pressure.set3DTouch('#el3', block);


Pressure.set('#peanuts-btn', {
  change: function(force, event){
    document.getElementById('peanuts').style.webkitFilter = 'blur(' + map(force, 0, 0.7, 20, 0) + 'px)';
  },

  end: function(){
    document.getElementById('peanuts').style.webkitFilter = 'blur(20px)';
  },

  unsupported: function(){
    document.getElementById('peanuts').innerHTML = 'Your device / browser does not support this :(';
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
