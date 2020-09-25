;(function($, window, undefined) {
  'use strict';
  var pluginName = 'collapse',
    win = $(window),
    collapseTimeout,
    resize = ('onorientationchange' in window) ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.activeEl = this.element.find(this.options.activeEl);
      this.handles = this.element.find(this.options.handle);
      this.initEl = this.element.find(this.options.initEl);
      this.contents = this.element.find(this.options.content);
      this.activeContent = [];
      this.closeEl = this.options.closeEl;
      this.duration = this.options.duration;
      this.isAnimating = false;
      this.show = 'slideDown';
      this.hide = 'slideUp';
      this.initCls = this.options.initCls;

      if(this.options.effect === 'fade') {
        this.show = 'fadeIn';
        this.hide = 'fadeOut';
      }
      if(this.options.effect === 'slide') {
        this.show = 'slideDown';
        this.hide = 'slideUp';
      }

      this.initialized();
      this.resizeWindow();
    },
    initialized: function() {
      if(!!this.options.breakpoint) {
        if(win.width() <= this.options.breakpoint) {
          this.options.type = '';
        }
        else {
          this.options.type = 'tab';
        }
      }

      if(!!this.options.initUnder) {
        if(win.width() <= this.options.initUnder) {
          this.listener();
          if(this.initEl.length) {
            this.collapseContent(this.initEl);
          }
        }
      }
      else {
        this.listener();
        if(this.initEl.length) {
          this.collapseContent(this.initEl);
        }
      }
    },
    listener: function() {
      var that = this;

      this.element.addClass(this.initCls);

      this.handles.off('click.changeTab' + pluginName).on('click.changeTab' + pluginName, function(e) {
        var handle = $(this).closest(that.element).find('[data-handle="' + $(this).data('handle') + '"]');

        if($(e.target).is('a')) {
          e.preventDefault();
        }

        if(!that.isAnimating) {
          that.collapseContent(handle);
        }
      });

      that.contents.off('click.closeTab' + pluginName, this.closeEl).on('click.closeTab' + pluginName, this.closeEl, function(e) {
        e.preventDefault();

        if(!that.isAnimating) {
          var childContentVisible = that.activeContent.find(that.options.content).not(':hidden');

          if(childContentVisible.length) {
            console.log('--- Close child Tabs - Button Close click ---');
            childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
          }

          console.log('--- Close current tab ---');
          that.close();
        }
        return false;
      });
    },
    resizeWindow: function() {
      var that = this;
      win.off(resize).on(resize, function() {
        if(collapseTimeout) {
          clearTimeout(collapseTimeout);
        }
        collapseTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').each(function() {
            var breakpoint = $(this).data()[pluginName].options[pluginName].breakpoint,
              initUnder = $(this).data()[pluginName].options[pluginName].initUnder;

            if(!!breakpoint) {
              if(win.width() <= breakpoint) {
                $(this).data()[pluginName].options[pluginName].type = '';
              }
              else {
                $(this).data()[pluginName].options[pluginName].type = 'tab';
              }
            }

            if(!!initUnder) {
              if(win.width() <= initUnder) {
                if(!$(this).hasClass(that.initCls)) {
                  $(this)[pluginName]('init');
                }
              }
              else {
                if($(this).hasClass(that.initCls)) {
                  $(this)[pluginName]('destroy');
                }
              }
            }
          });
        }, 300);
      });
    },
    collapseContent: function(handle) {
      var content = handle.closest(this.element).find('[data-content="' + handle.data('handle') + '"]');

      handle.find('input[type="radio"]').prop('checked', true);
      if(!content.length) {
        this.noContent(handle);
      }
      else {
        this.hasContent(handle, content);
      }
    },
    noContent: function(handle) {
      var that = this;
      console.log('--- No Content ---');
      this.activeEl.removeClass('active');
      handle.closest(this.activeEl).addClass('active');

      if(this.activeContent.length) {
        this.isAnimating = true;
        //- Before Close
        if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}
        this.activeContent.removeClass('active')[this.hide](this.duration, function() {
          //- After Close
          if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
          //- Remove activeContent
          that.activeContent = [];
          that.isAnimating = false;
        });
      }
    },
    hasContent: function(handle, content) {
      if(this.activeContent.length) {
        if(this.activeContent[0] !== content[0]) {
          this.changeTab(handle, content);
        }
        else if(this.options[pluginName].type !== 'tab') {
          this.closeCurrentTab(handle);
        }
      }
      else {
        this.firstOpen(handle, content);
      }
    },
    changeTab: function(handle, content) {
      var that = this,
        childContentVisible = this.activeContent.find(this.options.content).not(':hidden');

      if(childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Change Tab ---');
      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}

        //- Set new activeContent
        that.activeContent = content;
        //- Before Open
        if($.isFunction(that.options.beforeOpen)) {that.options.beforeOpen(that.activeContent);}

        handle.closest(that.activeEl).addClass('active');
        that.activeContent.addClass('active')[that.show](this.duration, function() {
          //- After Open
          if($.isFunction(that.options.afterOpen)) {that.options.afterOpen(that.activeContent, handle);}
          that.isAnimating = false;
        });
      });
    },
    closeCurrentTab: function(handle) {
      var that = this,
        childContentVisible = this.activeContent.find(this.options.content).not(':hidden');
      if(childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Close current tab ---');
      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      handle.closest(this.activeEl).removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
        //- Remove activeContent
        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    firstOpen: function(handle, content) {
      var that = this;
      console.log('--- First open ---');

      //- Set new activeContent
      that.activeContent = content;
      //- Before Open
      if($.isFunction(that.options.beforeOpen)) {that.options.beforeOpen(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      handle.closest(this.activeEl).addClass('active');
      that.activeContent.addClass('active')[this.show](this.duration, function() {
        //- After Open
        if($.isFunction(that.options.afterOpen)) {that.options.afterOpen(that.activeContent, handle);}
        that.isAnimating = false;
      });
    },
    close: function() {
      var that = this;

      //- Before Close
      if($.isFunction(that.options.beforeClose)) {that.options.beforeClose(that.activeContent);}

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](function() {
        //- After Close
        if($.isFunction(that.options.afterClose)) {that.options.afterClose(that.activeContent);}
        //- Remove ActiveContent
        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    destroy: function() {
      this.element.removeClass(this.initCls);
      this.element.find(this.options.content).removeAttr('style').removeClass('active');
      this.element.find(this.options.handle).removeClass('active');
      this.activeContent = [];
      this.isAnimating = false;
      this.handles.off('click.changeTab' + pluginName);
      //win.off(resize);
      //$.removeData(this.element[0], pluginName);
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
    handle: '[data-handle]',
    content: '[data-content]',
    activeEl: '[data-active]',
    initEl: '[data-init]',
    closeEl: '[data-close]',
    initCls: 'initCollapse',
    duration: 300,
    beforeClose: function(activeContent) {
      console.log('beforeClose');
      console.log(activeContent);
    },
    afterClose: function(activeContent) {
      console.log('afterClose');
      console.log(activeContent);
    },
    beforeOpen: function(activeContent) {
      console.log('beforeOpen');
      console.log(activeContent);
    },
    afterOpen: function(activeContent, handle) {
      if(activeContent.closest('.tmp-navigation .tmp-inner').length) {
        Site.scrollTopAfterCollapse(activeContent.closest('.tmp-navigation .tmp-inner'), handle, 0, true);
      }
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
