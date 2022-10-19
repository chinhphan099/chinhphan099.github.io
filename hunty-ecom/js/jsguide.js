"use strict";

/**
 * @name Guide
 * @description Global variables and functions
 * @version 1.0
 */
var Guide = function ($, window, undefined) {
  'use strict';

  var win = $(window),
      doc = $(document),
      html = $('html'),
      body = $('body'),
      resize = 'onorientationchange' in window ? 'orientationchange.resizeWindow' : 'resize.resizeWindow';

  var globalFct = function globalFct() {};

  return {
    win: win,
    doc: doc,
    html: html,
    body: body,
    resize: resize,
    globalFct: globalFct
  };
}(jQuery, window);

jQuery(function () {
  Guide.globalFct();
});
"use strict";

/**
 *  @name collapse(both Tabs & Accordion)
 *  @version 1.0
 *  @author: Phan Chinh
 *  @options
 *    handle: '[data-handle]'
 *    content: '[data-content]'
 *    activeEl: '[data-active]'
 *    initEl: '[data-init]'
 *    closeEl: '[data-close]'
 *    duration: 300
 *    beforeOpen: $.noop
 *    afterOpen: $.noop
 *    beforeClose: $.noop
 *    afterClose: $.noop
 *  @events
 *    Handle click
 *    CloseEl click
 *    Window resize
 *  @methods
 *    init
 *    initialized
 *    listener
 *    close
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'collapse',
      win = $(window),
      collapseTimeout,
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
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
      this.initSuccess = false;

      if (this.options.effect === 'fade') {
        this.show = 'fadeIn';
        this.hide = 'fadeOut';
      }

      if (this.options.effect === 'slide') {
        this.show = 'slideDown';
        this.hide = 'slideUp';
      }

      this.checkEmptyContent();
      this.resizeWindow();
    },
    checkEmptyContent: function checkEmptyContent() {
      var that = this;
      this.contents.each(function () {
        var self = $(this),
            handle = that.element.find('[data-handle="' + self.data('content') + '"]');

        if (!self.text().trim().length) {
          handle.closest('[data-active]').remove();
          self.remove();
        }
      });
      this.initialized();
    },
    initialized: function initialized() {
      var that = this;

      if (!!this.options.breakpoint) {
        if (win.width() <= this.options.breakpoint) {
          this.options.type = '';
        } else {
          this.options.type = 'tab';
        }
      }

      if (!!this.options.initUnder) {
        if (win.width() <= this.options.initUnder) {
          this.listener();

          if (this.initEl.length) {
            if (this.options.type === 'toggleSelf') {
              this.initEl.each(function () {
                that.toggleSelfEvent($(this));
              });
            } else {
              this.collapseContent(this.initEl);
            }
          }
        }
      } else {
        this.listener();

        if (this.initEl.length) {
          if (this.options.type === 'toggleSelf') {
            this.initEl.each(function () {
              that.toggleSelfEvent($(this));
            });
          } else {
            this.collapseContent(this.initEl);
          }
        }
      }
    },
    listener: function listener() {
      var that = this;
      this.element.addClass(this.initCls);
      this.handles.off('click.changeTab' + pluginName).on('click.changeTab' + pluginName, function (e) {
        var handle = $(this).closest(that.element).find('[data-handle="' + $(this).data('handle') + '"]');

        if ($(this).data('active') === 'linkout' && $(this).hasClass('active')) {
          return;
        } else if ($(e.target).is('a') || $(e.target).parent().is('a')) {
          e.preventDefault();
        }

        if (!that.isAnimating) {
          if (that.options.type === 'toggleSelf') {
            that.toggleSelfEvent(handle);
          } else {
            that.collapseContent(handle);
          }
        }
      });
      that.contents.off('click.closeTab' + pluginName, this.closeEl).on('click.closeTab' + pluginName, this.closeEl, function (e) {
        e.preventDefault();

        if (!that.isAnimating) {
          var childContentVisible = that.activeContent.find(that.options.content).not(':hidden');

          if (childContentVisible.length) {
            console.log('--- Close child Tabs - Button Close click ---');
            childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
          }

          console.log('--- Close current tab ---');
          that.close();
        }

        return false;
      });
    },
    resizeWindow: function resizeWindow() {
      var that = this;
      win.off(resize).on(resize, function () {
        if (collapseTimeout) {
          clearTimeout(collapseTimeout);
        }

        collapseTimeout = setTimeout(function () {
          $('[data-' + pluginName + ']').each(function () {
            var breakpoint = $(this).data(pluginName).options.breakpoint,
                initUnder = $(this).data(pluginName).options.initUnder;

            if (!!breakpoint) {
              if (win.width() <= breakpoint) {
                $(this).data(pluginName).options.type = '';
              } else {
                $(this).data(pluginName).options.type = 'tab';

                if (!$(this).data(pluginName).activeContent.length && $(this).data(pluginName).initEl.length) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('collapseContent', $(this).data(pluginName).initEl);
                }
              }
            }

            if (!!initUnder) {
              if (win.width() <= initUnder) {
                if (!$(this).hasClass(that.initCls)) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('init');
                }
              } else {
                if ($(this).hasClass(that.initCls)) {
                  $(this).filter('[data-' + pluginName + ']')[pluginName]('destroy');
                }
              }
            }
          });
        }, 300);
      });
    },
    toggleSelfEvent: function toggleSelfEvent(handle) {
      var that = this,
          content = handle.closest(this.element).find('[data-content="' + handle.data('handle') + '"]');
      that.isAnimating = true;

      if (!handle.closest(this.activeEl).hasClass('active')) {
        handle.addClass('active');
        content.addClass('active')[that.show](this.duration, function () {
          if ($.isFunction(that.options.afterOpen)) {
            that.options.afterOpen(content, handle, that);
          }

          that.isAnimating = false;
        });
      } else {
        handle.removeClass('active');
        content.removeClass('active')[that.hide](this.duration, function () {
          if ($.isFunction(that.options.afterClose)) {
            that.options.afterClose(content, handle);
          }

          that.isAnimating = false;
        });
      }
    },
    collapseContent: function collapseContent(handle) {
      var content = handle.closest(this.element).find('[data-content="' + handle.data('handle') + '"]');
      handle.find('input[type="radio"]').prop('checked', true);

      if (!content.length) {
        this.noContent(handle);
      } else {
        this.hasContent(handle, content);
      }
    },
    noContent: function noContent(handle) {
      var that = this;
      console.log('--- No Content ---');
      this.activeEl.removeClass('active');
      handle.closest(this.activeEl).addClass('active');

      if (this.activeContent.length) {
        this.isAnimating = true; //- Before Close

        if ($.isFunction(that.options.beforeClose)) {
          that.options.beforeClose(that.activeContent);
        }

        this.activeContent.removeClass('active')[this.hide](this.duration, function () {
          //- After Close
          if ($.isFunction(that.options.afterClose)) {
            that.options.afterClose(that.activeContent);
          } //- Remove activeContent


          that.activeContent = [];
          that.isAnimating = false;
        });
      }
    },
    hasContent: function hasContent(handle, content) {
      if (this.activeContent.length) {
        if (this.activeContent[0] !== content[0]) {
          this.changeTab(handle, content);
        } else if (this.options.type !== 'tab') {
          this.closeCurrentTab(handle);
        }
      } else {
        this.firstOpen(handle, content);
      }
    },
    changeTab: function changeTab(handle, content) {
      var that = this,
          childContentVisible = this.activeContent.find(this.options.content).not(':hidden');

      if (childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Change Tab ---'); //- Before Close

      if ($.isFunction(that.options.beforeClose)) {
        that.options.beforeClose(that.activeContent);
      }

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function () {
        //- After Close
        if ($.isFunction(that.options.afterClose)) {
          that.options.afterClose(that.activeContent);
        } //- Set new activeContent


        that.activeContent = content; //- Before Open

        if ($.isFunction(that.options.beforeOpen)) {
          that.options.beforeOpen(that.activeContent);
        }

        handle.closest(that.activeEl).addClass('active');
        that.activeContent.addClass('active')[that.show](this.duration, function () {
          //- After Open
          if ($.isFunction(that.options.afterOpen)) {
            that.options.afterOpen(that.activeContent, handle, that);
          }

          that.isAnimating = false;
        });
      });
    },
    closeCurrentTab: function closeCurrentTab(handle) {
      var that = this,
          childContentVisible = this.activeContent.find(this.options.content).not(':hidden');

      if (childContentVisible.length) {
        console.log('--- Close child Tabs - Tab click ---');
        childContentVisible.closest('[data-' + pluginName + ']')[pluginName]('close');
      }

      console.log('--- Close current tab ---'); //- Before Close

      if ($.isFunction(that.options.beforeClose)) {
        that.options.beforeClose(that.activeContent);
      }

      this.isAnimating = true;
      handle.closest(this.activeEl).removeClass('active');
      this.activeContent.removeClass('active')[this.hide](this.duration, function () {
        //- After Close
        if ($.isFunction(that.options.afterClose)) {
          that.options.afterClose(that.activeContent);
        } //- Remove activeContent


        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    firstOpen: function firstOpen(handle, content) {
      var that = this;
      console.log('--- First open ---'); //- Set new activeContent

      that.activeContent = content; //- Before Open

      if ($.isFunction(that.options.beforeOpen)) {
        that.options.beforeOpen(that.activeContent);
      }

      this.isAnimating = true;
      this.activeEl.removeClass('active'); //handle.closest(this.activeEl).addClass('active');

      this.element.find('[data-handle="' + handle.data('handle') + '"]').closest(this.activeEl).addClass('active');
      that.activeContent.addClass('active')[this.show](this.duration, function () {
        //- After Open
        if ($.isFunction(that.options.afterOpen)) {
          that.options.afterOpen(that.activeContent, handle, that);
        }

        that.isAnimating = false;
      });
    },
    close: function close() {
      var that = this; //- Before Close

      if ($.isFunction(that.options.beforeClose)) {
        that.options.beforeClose(that.activeContent);
      }

      this.isAnimating = true;
      this.activeEl.removeClass('active');
      this.activeContent.removeClass('active')[this.hide](function () {
        //- After Close
        if ($.isFunction(that.options.afterClose)) {
          that.options.afterClose(that.activeContent);
        } //- Remove ActiveContent


        that.activeContent = [];
        that.isAnimating = false;
      });
    },
    destroy: function destroy() {
      this.element.removeClass(this.initCls);
      this.element.find(this.options.content).removeAttr('style').removeClass('active');
      this.element.find(this.options.handle).removeClass('active');
      this.activeContent = [];
      this.isAnimating = false;
      this.handles.off('click.changeTab' + pluginName); //win.off(resize);
      //$.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
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
    htmlClass: '',
    beforeClose: function beforeClose(activeContent) {
      console.log('beforeClose');
      console.log(activeContent);
    },
    afterClose: function afterClose(activeContent) {
      console.log('afterClose');
      console.log(activeContent);
      $('html').removeClass(this.htmlClass);
      console.log(this.htmlClass);
    },
    beforeOpen: function beforeOpen(activeContent) {
      $('html').addClass(this.htmlClass);
      console.log('beforeOpen');
      console.log(activeContent);
    },
    afterOpen: function afterOpen(activeContent, handle, plugin) {
      var topHandle = handle.offset().top,
          topWindow = win.scrollTop();

      if (activeContent.closest('.navigation .inner').length && typeof Site !== 'undefined' && typeof Site.scrollTopAfterCollapse === 'function') {
        Site.scrollTopAfterCollapse(activeContent.closest('.navigation .inner'), handle, true);
      }

      if (plugin.initSuccess) {
        var gotop = handle.data('active');

        if (gotop === 'gotop' && (topHandle < topWindow || topHandle > topWindow + win.height() / 1.25) && !!Site && typeof Site.scrollTopAfterCollapse === 'function') {
          Site.scrollTopAfterCollapse($('html, body'), handle, false);
        }
      } else {
        plugin.initSuccess = true;
      }
    }
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name cookies
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'cookies';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.initialize();
      this.listener();
    },
    initialize: function initialize() {
      // Check Cookie
      if (this.readCookie('showSticky')) {// Show sticky
      }
    },
    listener: function listener() {
      var that = this;
      $('.close').off('click.' + pluginName).on('click.' + pluginName, function () {
        that.createCookie('showSticky');
      });
      $(window).off('unload.' + pluginName).on('unload.' + pluginName, function () {
        that.eraseCookie('showSticky');
      });
    },
    createCookie: function createCookie(name, value, days) {
      var expires = '';

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toGMTString();
      }

      document.cookie = name + '=' + value + expires + '; path=/';
    },
    readCookie: function readCookie(name) {
      var nameEQ = name + '=',
          ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }

      return null;
    },
    eraseCookie: function eraseCookie(name) {
      this.createCookie(name, '', -1);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name copies
 *  @description Click to copy
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    click
 *  @methods
 *    init
 *    selectContent
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'copies';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var that = this;
      this.handle = this.element.find(this.options.handle);
      this.copy = this.options.copy;
      this.isAnimating = false;
      this.handle.off('click.copies').on('click.copies', function () {
        if (!that.isAnimating) {
          that.selectContent($(this).find(that.copy));
        }
      });
    },
    selectContent: function selectContent(element) {
      var $temp = $('<input>'),
          that = this,
          value = element.data('copy') || element.text();
      this.isAnimating = true;
      element.after($temp);
      $temp.val(value);
      $temp.focus();
      document.execCommand('SelectAll');
      document.execCommand('Copy', false, null);
      $('.copied').html(value).show().delay(1000).fadeOut(300, function () {
        that.isAnimating = false;
      });
      $temp.remove();
    },
    destroy: function destroy() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    handle: '[data-handler]',
    copy: '[data-copy]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name sameheight
 *  @description Equal height of blocks on row
 *  @version 1.0
 *  @options
 *    parent: '[data-parent]'
 *    child: '[data-child]'
 *  @events
 *    Réize
 *  @methods
 *    init
 *    initialize
 *    checkImgLoad
 *    setSameHeight
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'sameheight',
      win = $(window),
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.parent = this.element.find(this.options.parent);
      this.childs = this.element.find(this.options.child);

      if (!this.parent.length) {
        return;
      }

      this.initialize();
      win.off(resize).on(resize, function () {
        $('[data-' + pluginName + ']')[pluginName]('initialize');
      });
    },
    initialize: function initialize() {
      if (this.element.find('img').length) {
        this.checkImgLoad();
      } else {
        this.setSameHeight();
      }
    },
    checkImgLoad: function checkImgLoad() {
      var that = this,
          imagesLoaded = 0,
          totalImages = this.element.find('img').length;
      this.element.find('img').each(function () {
        var fakeSrc = $(this).attr('src');
        $('<img />').attr('src', fakeSrc).css('display', 'none').on('load.' + pluginName, function () {
          ++imagesLoaded;

          if (imagesLoaded === totalImages) {
            $.isFunction(that.setSameHeight) && that.setSameHeight();
          }
        }).on('error.' + pluginName, function () {
          ++imagesLoaded;

          if (imagesLoaded === totalImages) {
            $.isFunction(that.setSameHeight) && that.setSameHeight();
          }
        });
      });
    },
    setSameHeight: function setSameHeight() {
      var perRow = Math.floor(this.element.width() / this.parent.width());
      this.parent.css('height', 'auto');
      this.childs.css('height', 'auto');

      if (perRow > 1) {
        for (var i = 0, n = this.parent.length; i < n; i += perRow) {
          var itemPerRow = this.parent.slice(i, i + perRow),
              totalPerRow = itemPerRow.length,
              child = '',
              maxHeight = 0,
              idx = 0,
              obj = {};
          itemPerRow.each(function (index) {
            idx = index;
            $(this).find('[data-child]').each(function () {
              child = $(this).attr('data-child');

              if (index % totalPerRow === 0 || obj[child] === undefined) {
                obj[child] = 0;
              }

              obj[child] = Math.max(obj[child], $(this).outerHeight());
            });
          });

          if (idx === totalPerRow - 1) {
            itemPerRow.each(function () {
              for (var key in obj) {
                $(this).find('[data-child="' + key + '"]').css('height', obj[key]);
              }

              maxHeight = Math.max(maxHeight, $(this).outerHeight());
            });

            if (this.options[pluginName] !== 'no4parent') {
              itemPerRow.css('height', maxHeight);
            }
          }
        }
      }
    },
    destroy: function destroy() {
      this.parent.css('height', 'auto');
      this.childs.css('height', 'auto');
      win.off(resize);
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    parent: '[data-parent]',
    child: '[data-child]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name scrollbar
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    initialized
 *    resizeEvent
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'scrollbar',
      isTouch = ('ontouchstart' in document.documentElement);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var that = this;
      this.vars = {
        theme: that.options.theme || 'dark',
        axis: that.options.axis || 'y',
        autoHideScrollbar: that.options.autoHideScrollbar || false,
        scrollAmount: that.options.scrollAmount || 'auto'
      };

      if (!isTouch) {
        this.defineOption();
      }
    },
    defineOption: function defineOption() {
      var that = this;
      this.option = {
        theme: this.vars.theme,
        axis: this.vars.axis,
        autoHideScrollbar: this.vars.autoHideScrollbar,
        autoExpandScrollbar: true,
        mouseWheel: {
          scrollAmount: this.vars.scrollAmount
        },
        callbacks: {
          onCreate: this.onCreate(that.element),
          onUpdate: this.onUpdate(that.element)
        }
      };

      if (!!this.options.scrollAmount) {
        this.option = $.extend({}, this.option, {
          snapAmount: this.vars.scrollAmount
        });
      }

      if (this.options.scrollButtons) {
        this.option = $.extend({}, this.option, {
          scrollButtons: {
            enable: true,
            scrollType: 'stepped'
          }
        });
      }

      if (this.options.autoHorizontal) {
        this.option = $.extend({}, this.option, {
          advanced: {
            autoExpandHorizontalScroll: true
          }
        });
      } // Call mCustomScrollbar


      this.initialized(this.option);
    },
    initialized: function initialized(option) {
      this.element.mCustomScrollbar(option);
    },
    onCreate: function onCreate() {
      console.log('onCreate');
    },
    onUpdate: function onUpdate() {
      console.log('onUpdate');
    },
    destroy: function destroy() {
      this.element.mCustomScrollbar('destroy');
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name slidemenu
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'slidemenu',
      win = $(window),
      userAgent = navigator.userAgent,
      isDevice = /IEMobile|Windows Phone|Lumia|iPhone|iP[oa]d|Android|BlackBerry|PlayBook|BB10|Mobile Safari|webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(userAgent) ? 1 : 0;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.vars = {
        isAnimating: false,
        isClose: true,
        handler: this.element.find(this.options.handler),
        mainContainer: this.element.find(this.options.mainContainer),
        header: this.element.find(this.options.header),
        inner: $(this.options.mainContainer).find(this.options.inner),
        lNav: this.element.find(this.options.lNav),
        rNav: this.element.find(this.options.rNav),
        dummyLayer: this.element.find(this.options.dummyLayer),
        leftNavCls: this.options.leftNavCls,
        rightNavCls: this.options.rightNavCls,
        duration: this.options.duration,
        sizePull: this.options.sizePull,
        sizePush: this.options.sizePush,
        topInner: 0
      };
      this.listener();
    },
    listener: function listener() {
      var that = this;

      if (this.options[pluginName].headerFixedOnFocus) {
        this.handleInputFocusAndBlur();
      }

      this.vars.handler.off('click.toggle' + pluginName).on('click.toggle' + pluginName, function () {
        if (!that.vars.isAnimating) {
          that.vars.openingCls = $(this).data('nav');
          that.vars.isAnimating = true;

          if (that.vars.isClose) {
            that.openMenu(that.vars.openingCls);
          } else {
            that.closeMenu(that.vars.openingCls);
          } // dummyLayer Event


          that.vars.dummyLayer.off('touchstart.' + pluginName).on('touchstart.' + pluginName, function () {
            that.closeMenu(that.vars.openingCls);
          });
        }
      });
    },
    openMenu: function openMenu(openingCls) {
      var that = this;

      if ($.isFunction(that.options.beforeOpen)) {
        that.options.beforeOpen();
      }

      this.vars.topInner = win.scrollTop();
      this.vars.inner.css('top', -(this.vars.topInner - this.vars.header.height()));
      $('html').addClass(this.vars.openingCls);
      that.vars.dummyLayer.fadeIn(that.vars.duration);

      switch (openingCls) {
        case this.vars.leftNavCls:
          //Slide Hide Main Container
          this.hideMainContainer('100%', this.vars.sizePush); //Slide Open Left Navigation

          this.vars.lNav.animate({
            left: '0%',
            right: '0%',
            opacity: 1,
            marginRight: this.vars.sizePull
          }, this.vars.duration);
          break;

        case this.vars.rightNavCls:
          //Slide Hide Main Container
          this.hideMainContainer('-100%', this.vars.sizePull); //Slide Open Right Navigation

          this.vars.rNav.animate({
            left: '0%',
            right: '0%',
            opacity: 1,
            marginLeft: this.vars.sizePull
          }, this.vars.duration);
          break;

        default:
      }

      this.vars.dummyLayer.on('touchstart.' + pluginName + ' click.' + pluginName, function () {
        that.closeMenu(openingCls);
      });
    },
    closeMenu: function closeMenu(openingCls) {
      var that = this;
      that.vars.dummyLayer.fadeOut(that.vars.duration); // Show Main Container

      this.showMainContainer();

      switch (openingCls) {
        case this.vars.leftNavCls:
          //Slide Close Left Navigation
          this.vars.lNav.animate({
            left: '-100%',
            right: '100%',
            opacity: 0.5,
            marginRight: 0
          }, {
            duration: this.vars.duration,
            complete: function complete() {
              $(this).removeAttr('style');
            }
          });
          break;

        case this.vars.rightNavCls:
          //Slide Close Right Navigation
          this.vars.rNav.animate({
            left: '100%',
            right: '-100%',
            opacity: 0.5,
            marginLeft: 0
          }, {
            duration: this.vars.duration,
            complete: function complete() {
              $(this).removeAttr('style');
            }
          });
          break;

        default:
      }

      that.vars.dummyLayer.off('touchstart.' + pluginName + ' click.' + pluginName);
    },
    hideMainContainer: function hideMainContainer(leftValue, marginLeft) {
      var that = this;
      this.vars.mainContainer.animate({
        left: leftValue,
        marginLeft: marginLeft
      }, {
        duration: that.vars.duration,
        complete: function complete() {
          that.afterAnimate(false);
        }
      });
    },
    showMainContainer: function showMainContainer() {
      var that = this;
      this.vars.mainContainer.animate({
        left: '0%',
        marginLeft: '0%'
      }, {
        duration: this.vars.duration,
        complete: function complete() {
          $('html').removeClass(that.vars.openingCls);
          $(this).removeAttr('style');
          that.vars.inner.removeAttr('style');
          window.scrollBy(0, that.vars.topInner);
          that.afterAnimate(true);

          if ($.isFunction(that.options.afterClose)) {
            that.options.afterClose();
          }
        }
      });
    },
    afterAnimate: function afterAnimate(isClose) {
      this.vars.isClose = isClose;
      this.vars.isAnimating = false;
    },
    handleInputFocusAndBlur: function handleInputFocusAndBlur() {
      if (isDevice) {
        // if(Detectizr.device.type === 'tablet' || Detectizr.device.type === 'mobile') {
        var that = this,
            focusing;
        $('input[type="text"], input[type="number"], input[type="tel"], input[type="email"], input[type="search"], select, textarea').off('focus.' + pluginName).on('focus.' + pluginName, function () {
          that.vars.header.find('.header-inner').css('position', 'relative');
          that.vars.header.css({
            //'position': 'absolute',
            'top': $(document).scrollTop()
          });
          $('html').addClass('inputFocusing');
          focusing = true;
        });
        $('input[type="text"], input[type="number"], input[type="tel"], input[type="email"], input[type="search"], select, textarea').off('blur.' + pluginName).on('blur.' + pluginName, function () {
          that.vars.header.find('.header-inner').removeAttr('style');
          that.vars.header.removeAttr('style');
          $('html').removeClass('inputFocusing');
          focusing = false;
        });
        win.off('scroll.scroll' + pluginName).on('scroll.scroll' + pluginName, function () {
          if (focusing) {
            that.vars.header.css({
              'opacity': 0,
              'top': $(document).scrollTop()
            });
          }

          clearTimeout($.data(this, 'scrollCheck'));
          $.data(this, 'scrollCheck', setTimeout(function () {
            if (focusing) {
              that.vars.header.css('opacity', 1);
              that.vars.lNav.css('opacity', 1);
            }
          }, 250));
        });
      }
    },
    destroy: function destroy() {
      $('html').removeClass(this.vars.openingCls);
      this.vars.mainContainer.removeAttr('style');
      this.vars.dummyLayer.removeAttr('style');
      this.vars.inner.removeAttr('style');
      this.vars.handler.off('click.toggle' + pluginName);
      $('input, select, textarea').off('focus.' + pluginName);
      $('input, select, textarea').off('blur.' + pluginName);
      $(window).off('scroll.' + pluginName);
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    handler: '[data-nav]',
    mainContainer: '.main-container',
    header: '.header',
    inner: '.inner',
    lNav: '.navigation',
    rNav: '.right-navigation',
    dummyLayer: '.dummy-layer',
    leftNavCls: 'open-left-nav',
    rightNavCls: 'open-right-nav',
    duration: 200,
    sizePull: '25%',
    sizePush: '-25%',
    beforeOpen: $.noop,
    afterClose: $.noop
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name sticky
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'sticky',
      win = $(window),
      resizeTimeout,
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.status = false;
      this.option = {
        offset_top: $('.nav-container').height()
      };

      if (win.width() > 767) {
        this.initialized();
      }

      this.listener();
    },
    listener: function listener() {
      win.off(resize).on(resize, function () {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        resizeTimeout = setTimeout(function () {
          $('[data-' + pluginName + ']').each(function () {
            if (win.width() > 767 && !$(this).data()[pluginName].status) {
              $(this)[pluginName]('init');
            } else if (win.width() < 767 && $(this).data()[pluginName].status) {
              $(this)[pluginName]('destroy');
            }
          });
        }, 300);
      });
    },
    initialized: function initialized() {
      this.status = true;
      this.element.stick_in_parent(this.option);
    },
    destroy: function destroy() {
      this.status = false;
      this.element.trigger('sticky_kit:detach'); //$.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};
  $(function () {
    if ($('body').hasClass('catalog-category-view') || $('body').hasClass('catalogsearch-result-index')) {
      $('[data-' + pluginName + ']')[pluginName]();
    }
  });
})(jQuery, window);
"use strict";

/**
 *  @name table
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    click
 *  @methods
 *    init
 *    initialized
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'table';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      if (this.element.find('tr').eq(0).find('td').length > 2) {
        this.initialized();
        this.listener();
      }
    },
    initialized: function initialized() {
      this.element.find('tr').find('td:last-child').addClass('last');
      this.element.find('tr').find('td:first-child').next().addClass('first');
      this.element.find('tr').eq(0).append('<td class="' + this.options.emptyTdCls + ' next-btn" data-next=""><a class="icon-angle-right"></a></td>').find('.head-title').after('<td class="' + this.options.emptyTdCls + ' prev-btn disabled" data-prev=""><a class="icon-angle-left"></a></td>');
      this.element.find('tr').eq(0).nextAll().append('<td class="' + this.options.emptyTdCls + '"></td>').find('.head-title').after('<td class="' + this.options.emptyTdCls + '"></td>');
      this.curentItems = [];

      for (var i = 2, n = 2 + this.options.items; i < n; i++) {
        this.curentItems.push(i);
      }

      this.addClassHandler(this.curentItems);
    },
    listener: function listener() {
      this.element.find(this.options.prevBtn).off('click.prev' + pluginName).on('click.prev' + pluginName, $.proxy(this.prevEvent, this));
      this.element.find(this.options.nextBtn).off('click.next' + pluginName).on('click.next' + pluginName, $.proxy(this.nextEvent, this));
    },
    prevEvent: function prevEvent() {
      if (!$(this.options.prevBtn).hasClass(this.options.disabledCls)) {
        $(this.options.nextBtn).removeClass(this.options.disabledCls); // Remove end

        this.curentItems.pop(); // Add first

        this.curentItems.unshift(this.curentItems[0] - 1);
        this.addClassHandler(this.curentItems);

        if (this.element.find('td').eq(this.curentItems[0]).hasClass('first')) {
          $(this.options.prevBtn).addClass(this.options.disabledCls);
        }
      }
    },
    nextEvent: function nextEvent() {
      if (!$(this.options.nextBtn).hasClass(this.options.disabledCls)) {
        $(this.options.prevBtn).removeClass(this.options.disabledCls); // Remove first

        this.curentItems.shift(); // Add end

        this.curentItems.push(this.curentItems[this.curentItems.length - 1] + 1);
        this.addClassHandler(this.curentItems);

        if (this.element.find('td').eq(this.curentItems[this.curentItems.length - 1]).hasClass('last')) {
          $(this.options.nextBtn).addClass(this.options.disabledCls);
        }
      }
    },
    addClassHandler: function addClassHandler(arr) {
      this.element.find('td.active').removeClass(this.options.activeCls);

      for (var i = 0, n = this.element.find('tr').length; i < n; i++) {
        for (var j = 0, m = arr.length; j < m; j++) {
          this.element.find('tr').eq(i).find('td').eq(arr[j]).addClass(this.options.activeCls);
        }
      }
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    disabledCls: 'disabled',
    activeCls: 'active',
    emptyTdCls: 'empty',
    prevBtn: '[data-prev]',
    nextBtn: '[data-next]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name Video
 *  @description Control Play/Pause/Ended Video HTML5
 *  @version 1.0
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'video';
  var Statuses = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };
  var ClassNames = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var that = this;
      this.status = Statuses.PAUSED;
      this.handle = this.element.find(this.options.handle);
      this.video = this.element.find('video');
      var isClick = false;
      this.handle.off('mousedown.' + pluginName).on('mousedown.' + pluginName, function () {
        isClick = true;
      }).off('mousemove.' + pluginName).on('mousemove.' + pluginName, function () {
        isClick = false;
      }).off('click.' + pluginName).on('click.' + pluginName, function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (isClick) {
          switch (that.status) {
            case Statuses.PAUSED:
            case Statuses.ENDED:
              that.firstPlay = true;
              that.playClip(that.firstPlay);
              break;

            case Statuses.PLAYING:
              that.pauseClip();
              break;
          }
        }
      });
      this.video.get(0).addEventListener('waiting', this.waitingLoad, false);
      this.video.get(0).addEventListener('pause', this.onPausing, false);
      this.video.get(0).addEventListener('playing', this.onPlaying, false);
      this.video.get(0).addEventListener('ended', this.endVideo, false);
    },
    playClip: function playClip() {
      if (this.firstPlay) {
        $('[data-youtube]').length && $('[data-youtube]').youtube('pauseClip');
        $('[data-video]').video('pauseClip');
        this.element.removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PLAYING);
        this.status = Statuses.PLAYING;
        this.video.get(0).play();
      }
    },
    pauseClip: function pauseClip() {
      if (this.status === Statuses.PLAYING) {
        this.element.removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PAUSED);
        this.status = Statuses.PAUSED;
        this.video.get(0).pause();
      }
    },
    waitingLoad: function waitingLoad() {
      $(this).closest('[data-' + pluginName + ']').addClass(ClassNames.LOADING);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.LOADING;
    },
    onPausing: function onPausing() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PAUSED);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.PAUSED;
    },
    onPlaying: function onPlaying() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED).addClass(ClassNames.PLAYING);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.PLAYING;
    },
    endVideo: function endVideo() {
      $(this).closest('[data-' + pluginName + ']').removeClass(ClassNames.PAUSED + ' ' + ClassNames.PLAYING).addClass(ClassNames.ENDED);
      $(this).closest('[data-' + pluginName + ']').data('video').status = Statuses.ENDED;
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, pluginName);

      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    handle: '[data-handle]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 *  @name youtube
 *  @description Control play/pause/end youtube, using youtube API
 *  @version 1.0
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'youtube';
  var Statuses = {
    UNLOAD: 'unload',
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };
  var ClassNames = {
    PAUSED: 'paused',
    PLAYING: 'playing',
    LOADING: 'loading',
    ENDED: 'ended'
  };

  var getYoutubeId = function getYoutubeId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.handle = this.element.find(this.options.handle);
      this.iframeCls = this.element.find(this.options.iframeCls);
      this.idVideo = !!getYoutubeId.call(this, this.options.idOrLink) ? getYoutubeId.call(this, this.options.idOrLink) : this.options.idOrLink;
      this.status = Statuses.UNLOAD;
      this.autoplay = this.options.autoplay ? this.options.autoplay : 0;

      if ((typeof YT === "undefined" ? "undefined" : _typeof(YT)) === 'object') {
        this.initYoutube();
      }
    },
    initYoutube: function initYoutube() {
      var that = this;
      that.player = new YT.Player(this.iframeCls.get(0), {
        videoId: that.idVideo,
        playerVars: {
          'autoplay': that.autoplay,
          'rel': 1,
          'showinfo': 0,
          'controls': 1,
          'modestbranding': 0
        },
        events: {
          onReady: function onReady() {
            that.listener();
          },
          onStateChange: function onStateChange(event) {
            that.onPlayerStateChange(event, that);
          }
        }
      });
    },
    listener: function listener() {
      var that = this,
          isClick = false;
      this.handle.off('mousedown.' + pluginName).on('mousedown.' + pluginName, function () {
        isClick = true;
      }).off('mousemove.' + pluginName).on('mousemove.' + pluginName, function () {
        isClick = false;
      }).off('click.' + pluginName).on('click.' + pluginName, function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (isClick) {
          // Check for touchmouve on slider
          switch (that.status) {
            case Statuses.UNLOAD:
            case Statuses.ENDED:
              that.playClip(true);
              break;

            case Statuses.PAUSED:
              that.playClip();
              break;

            case Statuses.PLAYING:
              that.pauseClip();
              break;

            case Statuses.LOADING:
              break;
          }
        }
      });
    },
    playClip: function playClip(isUnload) {
      if (isUnload || this.status === Statuses.PAUSED) {
        // Use on case use: $('[data-youtube]').youtube('pauseClip');
        $('[data-video]').length && $('[data-video]').video('pauseClip');
        $('[data-youtube]').youtube('pauseClip');
        this.player.playVideo();
        this.element.addClass(ClassNames.PLAYING).removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
      }
    },
    pauseClip: function pauseClip() {
      if (this.status === Statuses.PLAYING) {
        // Use on case use: $('[data-youtube]').youtube('pauseClip');
        this.player.pauseVideo();
        this.element.addClass(ClassNames.PAUSED).removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
      }
    },
    onPlayerStateChange: function onPlayerStateChange(event, plugin) {
      switch (event.data) {
        case YT.PlayerState.PAUSED:
          plugin.status = Statuses.PAUSED;
          plugin.element.addClass(ClassNames.PAUSED).removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
          break;

        case YT.PlayerState.PLAYING:
          plugin.status = Statuses.PLAYING;
          plugin.element.addClass(ClassNames.PLAYING).removeClass(ClassNames.PAUSED + ' ' + ClassNames.LOADING + ' ' + ClassNames.ENDED);
          break;

        case YT.PlayerState.BUFFERING:
          plugin.status = Statuses.LOADING;
          break;

        case YT.PlayerState.ENDED:
          plugin.status = Statuses.ENDED;
          plugin.element.addClass(ClassNames.ENDED).removeClass(ClassNames.PLAYING + ' ' + ClassNames.LOADING + ' ' + ClassNames.PAUSED);
          break;
      }
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
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
    iframeCls: '.iframeYoutube'
  };
  $(function () {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      $('[data-' + pluginName + ']')[pluginName]();
    };
  });
})(jQuery, window);
//# sourceMappingURL=jsguide.js.map
