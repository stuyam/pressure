var Router = {

  // this method will return a force value from the user and will automatically determine if the user has Force or 3D Touch
  // it also accepts an optional type, this type is passed in by the following 2 methods to be explicit about which change event type they want
  set : function(selector, closure, type){

    forEachElement(selector, function(index, element){
      var el = new Element(element, closure, type);
      el.routeEvents();
    });
  }

}
