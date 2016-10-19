/*! CSSDevices v2.2.0 | MIT license | Maintained by Stuart Yamartino | http://cssdevices.io */
$(function(){
  $('.cd-screen').each(function(){
    if($(this).hasClass('cd-smart-loader')){
      if(isSlideShow(this)){
        $('> :gt(0)', this).hide();
      }
      $('> :first-child',this).each(function(){
        handleLoadBinding(this);
      });
    }
    else{
      callSlideShow(this);
    }
  });

  function isSlideShow(_self){
    return $(_self).children().length > 1 && ! $(_self).hasClass('cd-no-slideshow');
  }

  function callSlideShow(_self){
    if(isSlideShow(_self)){
      var pauseSpeed = getOptionalData(_self, 'pause-speed', 5000);
      var transitionSpeed = getOptionalData(_self, 'transition-speed', 1000);
      $('> :gt(0)', _self).hide();
      if ( ! $(_self).hasClass('cd-smart-loader') ) {
        $('> :eq(0)', _self).css('display', 'block');
      }
      if( $(_self).hasClass('cd-transition-slider') ) {
        setInterval(function(){$('> :first-child',_self).animate({ 'margin-left': '-100%' }, transitionSpeed).next().css({'display':'block','margin-left': '100%'}).animate({ 'margin-left': '0%' }, transitionSpeed).end().appendTo(_self);}, pauseSpeed);
      }
      else{
        setInterval(function(){$('> :first-child',_self).fadeOut(transitionSpeed).next().fadeIn(transitionSpeed).end().appendTo(_self);}, pauseSpeed);
      }
    }
  }

  function handleLoadBinding(_self){
    $(_self).on('load', handleLoad);
    if (_self.complete) {
      $(_self).off('load', handleLoad);
      handleLoad.call(_self);
    }
  }

  function handleLoad(){
    var loadSpeed = getOptionalData($(this).parent('.cd-smart-loader')[0], 'fade-in-speed', 250);
    $(this).fadeIn(loadSpeed);
    callSlideShow($(this).parent()[0]);
  }

  function getOptionalData(saveThis, data, defaultValue){
    if ($(saveThis).attr('data-' + data)) {
      return $(saveThis).data(data);
    }
    return defaultValue;
  }

  $('.cd-device-loader').each(function(){
    if( ! $(this).hasClass('cd-fill-parent')){
      fadeDeviceIn(this);
    }
  });

  //// Container Filler ////
  var firstGo = true;
  var scale;
  fillContainer();
  $(window).resize(function(){
    fillContainer();
  });

  function fillContainer(){
    $('.cd-fill-parent').each(function(){
      if( firstGo ){
        $(this).data('initial-width', $(this).width());
      }
      if( $(this).hasClass('cd-padded-device')){
        var fontPercentage = ($(this).parent().width() - 40)/parseInt($(this).data('initial-width')) * 100;
      }
      else{
        var fontPercentage = $(this).parent().width()/parseInt($(this).data('initial-width')) * 100;
      }
      $(this).css('font-size', fontPercentage + '%');
      if( firstGo ){
        fadeDeviceIn(this);
      }
    });
    firstGo = false;
  }

  function fadeDeviceIn(_self){
    $(_self).css('visibility', 'visible').hide().fadeIn(getOptionalData(_self, 'fade-in-speed', 250));
  }

});
