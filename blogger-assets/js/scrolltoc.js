;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scrollto',
    win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        el = this.element,
        destination = el.data(pluginName);

      this.toggleShow();
      win.off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
        that.toggleShow();
      });
      el.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.scrollTo(destination);
      });
    },
    toggleShow: function() {
      if(this.options[pluginName] === 'body') {
        if(win.scrollTop() > 300) {
          this.element.fadeIn('slow');
        }
        else {
          this.element.fadeOut('slow');
        }
      }
    },
    scrollTo: function(elm) {
      var that = this,
        scrollTo = $(elm).offset().top;
        console.log(0);

      $('html, body').animate({
        scrollTop: scrollTo
      }, that.options.duration, 'easeOutCubic');
    },
    destroy: function() {
      this.element.off('click.' + pluginName);
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    duration: 600
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
