function prepareForForceClick(event)
{
  // Cancel the system's default behavior
  event.preventDefault()
  console.log('prepareForForceClick');
  // Perform any other operations in preparation for a force click
}

function enterForceClick(event)
{
  log('enterForceClick');
  // Perform operations in response to entering force click
}

function endForceClick(event)
{
  log('endForceClick');
  // Perform operations in response to exiting force click
}

function forceChanged(e)
{
  console.log(e);
  // log('forceChanged');
  // Perform operations in response to changes in force
}

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


var ForceTouch = {

  change: function(element, changeFunction){
    this.queryElement(element).addEventListener("webkitmouseforcechanged", function(event){
      changeFunction(event.webkitForce, event);
    }, false);
  },

  // This is method is to determine if the browser and/or user have support for force touch
  supported: function(input){
    var supported = {

      browserSupported: function(){
        return ('onwebkitmouseforcewillbegin' in document) || ('touchstart' in document);
      },

      browserSuccess: function(input){
        supported.input = input;
        supported.enabled = false;
        document.addEventListener("webkitmouseforcewillbegin", supported.forceTrackpad, false);
        document.addEventListener('touchstart', supported.threeDTouch, false);
        document.addEventListener("mousedown", supported.returnSupport);
      },

      returnSupport: function(){
        document.removeEventListener("webkitmouseforcewillbegin", supported.setEnabledTrue);
        document.removeEventListener("mousedown", supported.returnSupport);
        supported.enabled ? supported.input.success() : supported.input.failure(supported.failure('device', 'device does not support force touch'));
      },

      failure: function(type, message){
        return {
          'error' : {
            'type'    : type,
            'message' : message
          }
        }
      },

      forceTrackpad: function(){
        supported.type = 'force';
        supported.setEnabledTrue();
      },

      threeDTouch: function(event){
        if(event.touches[0].force !== undefined){
          supported.type = '3d';
          supported.setEnabledTrue();
        }
      },

      setEnabledTrue: function(){
        supported.enabled = true;
      }
    }
    if(!supported.browserSupported()){
      input.failure(supported.failure('browser', 'browser does not support force touch'));
    } else {
      supported.browserSuccess(input);
    }
  },

  queryElement: function(element){
    return document.querySelector(element);
  }

}

ForceTouch.supported({
  success:function(){
    ForceTouch.change('#element', function(force, event){
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
