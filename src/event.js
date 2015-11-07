var Event = {

  // this method builds events and handles event support on ever public method called by user
  build: function(selector, userClosure, closure){

    // if the user has pressure support
    if(Support.forPressure){
      closure();
    }
    // if the user doesn't have pressure support, run failure closure if it exists
    else if(Support.hasRun){
      getFailClosure(userClosure)(failureObject());
    }
    // the user has not been tested for support yet, test their support and build closure
    else {
      Browser.checkSupport({
        success: function(){
          closure();
        },
        fail: getFailClosure(userClosure)
      });
    }
  },

  // this handles the executing of the Force Touch change event
  changeForceTouch: function(selector, closure){
    // loop over each item that is returned
    forEach(queryElement(selector), function(index, element){
      element.addEventListener('webkitmouseforcechanged', function(event){
        getSuccessClosure(closure).call(element, event.webkitForce, event);
      }, false);
    });
  },

  // this handles the executing of the 3D Touch change event
  change3DTouch: function(selector, closure){
    console.log('ete')
    // loop over each item that is returned
    forEach(queryElement(selector), function(index, element){
      // create new Touch3D object
      var touch = new Touch3D();
      // add event for touch start
      element.addEventListener('touchstart', function(event){
        touch.startCheckingForce(event, closure, element);
      }, false);

      // // add event for touch move and set changeExecute
      // element.addEventListener('touchmove', function(event){
      //   // Touch3D.changeExecute = success;
      //   Touch3D.startCheckingForce(event, closure);
      // }, false);

      // add event touch end to stop the change from running
      element.addEventListener('touchend', function(event){
        touch.up();
      }, false);
    });
  },
}
