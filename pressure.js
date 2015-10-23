// function prepareForForceClick(event)
// {
//   // Cancel the system's default behavior
//   event.preventDefault()
//   console.log('prepareForForceClick');
//   // Perform any other operations in preparation for a force click
// }

// function enterForceClick(event)
// {
//   log('enterForceClick');
//   // Perform operations in response to entering force click
// }

// function endForceClick(event)
// {
//   log('endForceClick');
//   // Perform operations in response to exiting force click
// }

// function forceChanged(e)
// {
//   console.log(e);
//   // log('forceChanged');
//   // Perform operations in response to changes in force
// }

// function setupForceClickBehavior(someElement)
// {
//   // Attach event listeners in preparation for responding to force clicks
//   someElement.addEventListener("webkitmouseforcewillbegin", prepareForForceClick, false);
//   someElement.addEventListener("webkitmouseforcedown", enterForceClick, false);
//   someElement.addEventListener("webkitmouseforceup", endForceClick, false);
  // someElement.addEventListener("webkitmouseforcechanged", forceChanged, false);
// }

// function log(logMe){
//   console.log(logMe);
// }

// function ready(fn) {
//   if (document.readyState != 'loading'){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }

// ready(function(){
//   var someElement = document.getElementById('element');
//   setupForceClickBehavior(someElement);
// });


var Pressure = {

  //--------------------- Public API Section ---------------------//

  // This method is to determine if the browser and/or user have support for force touch of 3D touch
  // When this method is run, it will immediatly return if the browser does not support the force/3D touch,
  // however it will not return if the user has an supported trackpad or device until a click happens somewhere on the page
  supported: function(input){
    if(!this.support.browserSupported()){
      input.failure(supported.failure('browser', 'browser does not support force touch'));
    } else {
      this.support.browserSuccess(input);
    }
  },

  // This method will return a force value from the user and will automatically determine if the user has force or 3D touch
  change: function(element, changeFunction){
    if(this.support.type === 'force'){
      this.changeForceTouch(element, changeFunction);
    } else if(this.support.type === '3d'){
      this.change3DTouch(element, changeFunction);
    }
  },

  // This method is meant to be called when targeting ONLY devices with force touch
  changeForceTouch: function(element, changeFunction){
    this.queryElement(element).addEventListener("webkitmouseforcechanged", function(event){
      changeFunction(event.webkitForce, event);
    }, false);
  },

  // This method is meant to be called when targeting ONLY devices with 3D touch
  change3DTouch: function(element, changeFunction){
    var el = this.queryElement(element);
    el.addEventListener("touchstart", function(event){
      this.touch3D.changeExacute = changeFunction;
      this.touch3D.startCheckingForce(event);
    }, false);
    el.addEventListener("touchmove", function(event){
      this.touch3D.changeExacute = changeFunction;
      this.touch3D.startCheckingForce(event);
    }, false);
    el.addEventListener("touchend", function(event){
      this.touch3D.touchDown = false;
    }, false);
  },



  //--------------------- Start of "Private" classes / methods ---------------------//
  touch3D: {
    startCheckingForce: function(event) {
      this.touchDown = true;
      this.touch = event.touches[0];
      if(this.touch){
        this.fetchForce.bind(this);
      }
    },

    fetchForce: function() {
      if(this.touchDown !== false) {
        setTimeout(this.fetchForce, 10);
        return this.touch.force || 0;
      } else {
        return 0;
      }
    }
  },

  support: {
    browserSupported: function(){
      return ('onwebkitmouseforcewillbegin' in document) || ('touchstart' in document);
    },

    browserSuccess: function(input){
      this.input = input;
      this.enabled = false;
      document.addEventListener("webkitmouseforcewillbegin", this.touchForceEnabled.bind(this), false);
      document.addEventListener("touchstart", this.touch3DEnabled.bind(this), false);
      document.addEventListener("mousedown", this.returnSupport.bind(this));
    },

    removeDocumentListeners: function(){
      document.removeEventListener("webkitmouseforcewillbegin", this.touchForceEnabled);
      document.removeEventListener("touchstart", this.touch3DEnabled);
      document.removeEventListener("mousedown", this.returnSupport);
    },

    returnSupport: function(){
      this.removeDocumentListeners();
      this.enabled ? this.input.success() : this.input.failure(this.failure('device', 'device does not support force touch'));
    },

    failure: function(type, message){
      return {
        'error' : {
          'type'    : type,
          'message' : message
        }
      }
    },

    touchForceEnabled: function(){
      this.type = 'force';
      this.setEnabledTrue();
    },

    touch3DEnabled: function(event){
      if(event.touches[0].force !== undefined){
        this.type = '3d';
        this.setEnabledTrue();
      }
    },

    setEnabledTrue: function(){
      this.enabled = true;
    }
  },

  queryElement: function(element){
    return document.querySelector(element);
  }

}

Pressure.supported({
  success:function(){
    Pressure.change('#element', function(force, event){
      document.getElementById('element').style.width = Math.max((200 * force), 200) + 'px';
      document.getElementById('element').innerHTML = force;
      // console.log(force);
    });
    // console.log('User and Browser both support force touch');
  },
  failure:function(error){
    console.log(error);
  }
});

// document.getElementById('element').addEventListener("webkitmouseforcechanged", forceChanged, false);
