"use strict";

// Polyfill Closest
if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i,
        el = this;

    do {
      i = matches.length;

      while (--i >= 0 && matches.item(i) !== el) {}
    } while (i < 0 && (el = el.parentElement));

    return el;
  };
} // End Polyfill Closest


(function (global, undefined) {
  'use strict';

  function productTypeOnSearchPage() {
    var selectedType = document.querySelector('.product-type__selected');

    if (!!selectedType) {
      selectedType.addEventListener('click', function (e) {
        e.currentTarget.closest('.product-type__list').classList.toggle('active');
      });
    }
  }

  function searchEventOnHeader() {
    var searchBtnDk = document.getElementById('search_btn');

    if (!!searchBtnDk) {
      searchBtnDk.addEventListener('click', function () {
        document.querySelector('.header__search-auto-complete').classList.toggle('active');
      });
    }

    var searchBtnMb = document.querySelector('.header__search-btn');

    if (!!searchBtnMb) {
      searchBtnMb.addEventListener('click', function () {
        document.querySelector('body').classList.add('open-search');
      });
    }

    var backBtn = document.querySelector('.header__btn-back');

    if (!!backBtn) {
      backBtn.addEventListener('click', function () {
        document.querySelector('body').classList.remove('open-search');
      });
    }
  }

  function loginModal() {
    var loginModal = document.querySelector('.login-modal');

    if (!!loginModal) {
      loginModal.addEventListener('click', function (e) {
        if (!!e.target.closest('.modal__content') || !e.target.closest('.close')) {
          return;
        }

        document.querySelector('body').classList.remove('open-modal');
      });
    }

    var loginBtns = document.querySelectorAll('.header__login');
    Array.prototype.slice.call(loginBtns).forEach(function (loginBtn) {
      loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('body').classList.add('open-modal');
      });
    });
    var closeModal = document.querySelector('.modal .close');

    if (!!closeModal) {
      closeModal.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('body').classList.remove('open-modal');
      });
    }
  }

  function handleTabEventsGlobal() {
    var tabItems = document.querySelectorAll('[data-collapse] [data-handle]');
    Array.prototype.slice.call(tabItems).forEach(function (tabItem) {
      tabItem.addEventListener('click', function (e) {
        var dataContent = e.currentTarget.dataset.handle;
        var wrapper = e.currentTarget.closest('[data-collapse]');
        var contentItem = wrapper.querySelector("[data-content=\"".concat(dataContent, "\"]"));

        if (!contentItem.classList.contains('active')) {
          wrapper.querySelector('[data-content].active').classList.remove('active');
          wrapper.querySelector('[data-active].active').classList.remove('active');
          e.currentTarget.closest('[data-active]').classList.add('active');
          contentItem.classList.add('active');
        }
      });
    });
  }

  function productDetailEvents() {
    var viewAllDescription = document.querySelector('.product-description .view-all');

    if (!!viewAllDescription) {
      viewAllDescription.addEventListener('click', function (e) {
        e.currentTarget.closest('.product-description').querySelector('.editor').classList.toggle('show-all');
      });
    }
  }

  function handleMobileNavOnShopManagement() {
    var openNavControler = document.querySelector('.shop-nav .nav-menu');

    if (!!openNavControler) {
      openNavControler.addEventListener('click', function (e) {
        e.currentTarget.closest('.shop-nav').classList.add('active');
      });
    }

    var closeNavControler = document.querySelector('.shop-nav .nav-close');

    if (!!closeNavControler) {
      closeNavControler.addEventListener('click', function (e) {
        e.currentTarget.closest('.shop-nav').classList.remove('active');
      });
    }
  }

  function handleEventsOnCheckoutDelivery() {
    var changeDeliveryMothod = document.querySelector('.link_change');

    if (!!changeDeliveryMothod) {
      changeDeliveryMothod.addEventListener('click', function () {
        document.querySelector('.checkout_address__form').classList.add('active');
        document.querySelector('.checkout_address').classList.add('hidden');
      });
    }
  }

  function followShopEvent() {
    var followShopBtn = document.getElementById('followShop');

    if (!!followShopBtn) {
      followShopBtn.addEventListener('click', function (e) {
        e.currentTarget.classList.toggle('active');
      });
    }
  }

  function listener() {
    productDetailEvents();
    productTypeOnSearchPage();
    handleEventsOnCheckoutDelivery();
    searchEventOnHeader();
    loginModal();
    handleTabEventsGlobal();
    handleMobileNavOnShopManagement();
    followShopEvent();
  }

  window.addEventListener('load', function () {
    listener();
  });
})(window);
"use strict";

/**
 *  @name date
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    updateValue
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'date';

  var convertToDMY = function convertToDMY(date) {
    var day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }

    return day + '/' + month + '/' + year;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var that = this;
      this.valueContainer = this.element.find(this.options.valueContainer);
      this.inputElm = this.element.find(this.options.inputElm);
      this.updateValue();
      this.inputElm.off('change.changeValue').on('change.changeValue', function () {
        var idDate = $(this).attr('id');
        that.updateValue();

        if ($(this).prop('required')) {
          $(this).closest('form').validate().element('#' + idDate);
        }
      });
    },
    updateValue: function updateValue() {
      var date = this.inputElm.val();

      if (date === '') {
        this.valueContainer.text(this.inputElm.attr('placeholder'));
        this.element.removeClass(this.options.selectedCls);
      } else {
        this.valueContainer.text(convertToDMY.call(this, new Date(date)));
        this.element.addClass(this.options.selectedCls);
      }
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
    valueContainer: 'span',
    inputElm: 'input',
    selectedCls: 'selected'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name number
 *  @description description
 *  @version 1.0
 *  @events
 *    change
 *    keydown
 *  @methods
 *    init
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'number';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.input = this.element.find(this.options.input);
      this.increase = this.element.find(this.options.increase);
      this.decrease = this.element.find(this.options.decrease);
      this.listener();
    },
    listener: function listener() {
      var that = this;
      this.handle = this.options[pluginName].handle;
      this.maxLength = this.options[pluginName].maxLength;
      this.input.off('keydown.typeText').on('keydown.typeText', function (e) {
        if (!(e.keyCode > 95 && e.keyCode < 106 || e.keyCode > 47 && e.keyCode < 58 || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46)) {
          return false;
        }

        if ($(this).val().length === that.maxLength) {
          if (e.keyCode > 95 && e.keyCode < 106 || e.keyCode > 47 && e.keyCode < 58) {
            return false;
          }
        }
      });
      this.input.off('keyup.typeText, change.changeValue').on('keyup.typeText, change.changeValue', function () {
        if (that.val !== $(this).val()) {
          that.val = $(this).val();
          that.updateValue(that.val < 1 ? 1 : that.val, that.handle);
        }
      });
      this.increase.off('click.increase' + pluginName).on('click.increase' + pluginName, function () {
        that.val = that.input.val();
        that.updateValue(++that.val, that.handle);
      });
      this.decrease.off('click.decrease' + pluginName).on('click.decrease' + pluginName, function () {
        that.val = that.input.val();

        if (that.val > 1) {
          that.updateValue(--that.val, that.handle);
        }
      });
    },
    updateValue: function updateValue(value, handle) {
      if (!!handle) {
        $('[data-' + pluginName + ']').filter(function () {
          return $(this).data()[pluginName].options[pluginName].handle === handle;
        }).find(this.options.input).val(value);
      }
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
    input: '[data-input]',
    increase: '[data-increase]',
    decrease: '[data-decrease]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name pinchzoom
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

  var pluginName = 'pinchzoom',
      timeResize,
      win = $(window),
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.handle = this.element.find(this.options.handle);
      this.closezoom = this.element.find(this.options.closezoom);
      this.img = this.options.img;
      this.initialize(this.options.img);
      this.listener();
    },
    listener: function listener() {
      var that = this;
      this.closezoom.off('mousedown.close' + pluginName).on('mousedown.close' + pluginName, function () {
        that.destroy();
      });
      win.on(resize, function () {
        if (timeResize) {
          clearTimeout(timeResize);
        }

        timeResize = setTimeout(function () {
          $('[data-' + pluginName + ']').each(function () {
            if ($(this).css('opacity') !== '0') {
              $(this)[pluginName]('destroy');
              $(this)[pluginName]('initialize');
            }
          });
        }, 300);
      });
    },
    initialize: function initialize(imgSrc) {
      if (this.img) {
        this.img = imgSrc && this.img !== imgSrc ? imgSrc : this.img;
      } else {
        this.img = imgSrc;
      }

      if (!!this.img) {
        if (this.options.initUnder) {
          if (win.width() < this.options.initUnder) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          } else {
            this.destroy();
          }
        } else if (this.options.initUpper) {
          if (win.width() > this.options.initUpper) {
            this.element.addClass('showZoomContainer');
            this.initSmoothZoom();
          } else {
            this.destroy();
          }
        } else {
          this.element.addClass('showZoomContainer');
          this.initSmoothZoom();
        }
      }
    },
    initSmoothZoom: function initSmoothZoom() {
      var that = this;
      this.handle.smoothZoom({
        image_url: that.img,
        initial_ZOOM: 500,
        zoom_BUTTONS_SHOW: false,
        pan_BUTTONS_SHOW: false,
        border_SIZE: 0,
        responsive: true,
        width: '100%',
        height: '100%'
      });
    },
    destroy: function destroy() {
      this.handle.smoothZoom('destroy');
      this.handle.removeAttr('style');
      this.handle.removeAttr('class');
      this.element.removeClass('showZoomContainer');
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
    closezoom: '[data-closezoom]'
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name popup
 *  @description Use fancybox
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

  var pluginName = 'popup';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.vars = {
        handle: $(this.options.handle)
      };
      this.defineOption();
      this.listener();
    },
    defineOption: function defineOption() {
      this.vars.config = {
        type: this.options.type ? this.options.type : 'image',
        autoFocus: false,
        backFocus: false,
        trapFocus: false,
        transitionEffect: 'fade',
        caption: $.noop,
        afterLoad: this.afterLoad,
        beforeLoad: this.beforeLoad,
        beforeShow: this.beforeShow,
        beforeClose: this.beforeClose
      };
    },
    listener: function listener() {
      var that = this;
      this.vars.handle.off('click.open' + pluginName).on('click.open' + pluginName, function () {
        $.fancybox.open(that.vars.handle, that.vars.config, that.vars.handle.index(this));
        return false;
      });
    },
    beforeShow: function beforeShow() {},
    beforeLoad: function beforeLoad() {},
    afterLoad: function afterLoad() {
      $('[data-cslider]', '.fancybox-container').cslider('init');
    },
    beforeClose: function beforeClose() {},
    closePopup: function closePopup() {
      $.fancybox.close('all');
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
 *  @name scrollto
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

  var pluginName = 'scrollto',
      win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var _this = this;

      var el = this.element,
          destination = this.options.handle,
          initUnder = this.options.initUnder;
      this.toggleShow();
      win.off('scroll.' + pluginName).on('scroll.' + pluginName, function () {
        _this.toggleShow();
      });
      el.off('click.' + pluginName).on('click.' + pluginName, function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (win.width() < initUnder && $(destination).length) {
          _this.scrollTo(destination);
        }
      });
    },
    toggleShow: function toggleShow() {
      if (this.options[pluginName].handle === 'body') {
        if (win.scrollTop() > 500) {
          this.element.fadeIn('slow');
        } else {
          this.element.fadeOut('slow');
        }
      }
    },
    scrollTo: function scrollTo(elm) {
      var scrollTo = !!$(elm).length ? $(elm).offset().top : 0;
      $('html, body').animate({
        scrollTop: scrollTo
      }, this.options.duration, 'easeOutCubic'); // jquery.easing.1.3.js
    },
    destroy: function destroy() {
      this.element.off('click.' + pluginName);
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
    duration: 600,
    initUnder: 9999
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CustomSelect = /*#__PURE__*/function () {
  function CustomSelect(elm) {
    _classCallCheck(this, CustomSelect);

    this.selects = document.querySelectorAll(elm);
    this.selectedCls = 'selected';
    this.initCls = 'select-inited';
  }

  _createClass(CustomSelect, [{
    key: "checkSelectedValue",
    value: function checkSelectedValue(select) {
      if (select.value !== '') {
        select.parentNode.classList.add(this.selectedCls);
      } else {
        select.parentNode.classList.remove(this.selectedCls);
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      Array.prototype.slice.call(this.selects).forEach(function (select) {
        _this.checkSelectedValue(select); // If select was init before(has class select-inited) then return.


        if (select.parentNode.classList.contains(_this.initCls)) {
          return;
        }

        select.parentNode.classList.add(_this.initCls);
        select.addEventListener('change', function (e) {
          _this.checkSelectedValue(e.currentTarget);
        });
      });
    }
  }]);

  return CustomSelect;
}();

var customSelect = new CustomSelect('[data-select] select');
customSelect.init();
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 *  @name slider
 *  @version 1.0
 *  @events
 *    afterChange - Event of Slick slider
 *  @methods
 *    init
 *    initialize
 *    checkImgLoad
 *    initSlider
 *    setPositionArrows
 *    slickPause
 *    slickPlay
 *    destroy
 */
;

(function ($, window, undefined) {
  'use strict';

  var pluginName = 'cslider',
      timeResize,
      win = $(window),
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName,
      TypeSliders = {
    SINGLE: 'single',
    CAROUSEL: 'carousel',
    CENTERMODE: 'centerMode',
    VIDEOSLIDE: 'videoSlide',
    VARIABLEWIDTH: 'variableWidth',
    PROMOTION: 'promotion',
    PRODUCT: 'product',
    PRICINGSLIDE: 'pricingslide',
    VERTICAL: 'vertical',
    TWOROW: 'tworow',
    TWOROWPRODUCT: 'tworowproduct',
    SYNCING: 'syncing'
  },
      States = {
    BEFORECHANGE: 'beforechange',
    AFTERCHANGE: 'afterchange',
    RESIZE: 'resize'
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.handle = this.element.find(this.options.handle);
      this.smoothZoom = this.element.find(this.options.smoothZoom);

      if (this.handle.is(':visible')) {
        if (this.options.initUnder) {
          if (win.width() <= this.options.initUnder) {
            this.handle.removeClass('no-slide');
            this.initialize();
          } else {
            this.handle.addClass('no-slide');
          }
        } else {
          this.initialize();
        }

        win.on(resize, function () {
          if (timeResize) {
            clearTimeout(timeResize);
          }

          timeResize = setTimeout(function () {
            $('[data-' + pluginName + ']').each(function () {
              if ($(this).data()[pluginName].options[pluginName].hasZoom) {
                $(this)[pluginName]('zoomEffect', States.RESIZE);
              }

              if ($('.slick', this).is(':visible')) {
                if ($(this).data()[pluginName].options[pluginName].initUnder) {
                  if (win.width() < $(this).data()[pluginName].options[pluginName].initUnder) {
                    $('.slick', this).removeClass('no-slide');

                    if (!$('.slick', this).hasClass('slick-initialized')) {
                      $(this)[pluginName]('initialize');
                    } else {
                      $(this)[pluginName]('setPositionArrows');
                    }
                  } else if ($('.slick', this).hasClass('slick-initialized')) {
                    $('.slick', this).addClass('no-slide');
                    $(this)[pluginName]('destroy');
                  }
                } else {
                  $(this)[pluginName]('setPositionArrows');
                  $(this)[pluginName]('slickNoSlide'); // Just only have on Resize event.

                  if ($('.slick', this).hasClass('no-slide')) {
                    $(this)[pluginName]('destroy');
                    $(this)[pluginName]('init');
                  }
                }
              }
            });
          }, 600);
        });
      }
    },
    initialize: function initialize() {
      if (this.element.find('img').length) {
        this.checkImgLoad();
      } else {
        this.initSlider();
      }
    },
    checkImgLoad: function checkImgLoad() {
      var that = this,
          fakeSrc = this.element.find('img:visible').first().attr('src');
      $('<img />').attr('src', fakeSrc).css('display', 'none').on('load.' + pluginName, function () {
        that.initSlider();
      }).on('error.' + pluginName, function () {
        that.initSlider();
      });
    },
    initSlider: function initSlider() {
      var that = this,
          option,
          navFor = {};
      this.handle.on('init.' + pluginName, function (event, slick) {
        that.onInitSlick(event, slick);
      });

      switch (this.options.type) {
        case TypeSliders.SINGLE:
          option = this.options.singleSlider;
          break;

        case TypeSliders.CAROUSEL:
          option = this.options.carousel;
          break;

        case TypeSliders.CENTERMODE:
          option = this.options.centerMode;
          break;

        case TypeSliders.VIDEOSLIDE:
          option = this.options.videoSlide;
          break;

        case TypeSliders.VARIABLEWIDTH:
          option = this.options.variableWidth;
          break;

        case TypeSliders.PROMOTION:
          option = this.options.promotion;
          break;

        case TypeSliders.PRODUCT:
          option = this.options.product;
          break;

        case TypeSliders.PRICINGSLIDE:
          option = this.options.pricingslide;
          break;

        case TypeSliders.VERTICAL:
          option = this.options.vertical;
          break;

        case TypeSliders.TWOROW:
          option = this.options.tworow;
          break;

        case TypeSliders.TWOROWPRODUCT:
          option = this.options.tworowproduct;
          break;

        case TypeSliders.SYNCING:
          if (this.options.view) {
            navFor.asNavFor = this.options.navFor;
            option = $.extend(this.options.sycingView, navFor);
          } else {
            navFor.asNavFor = this.options.navFor;
            option = $.extend(this.options.sycingThumb, navFor);
          }

          break;

        default:
          option = this.options.singleSlider;
      } // Dots


      if (typeof this.options.dots !== 'undefined') {
        option = $.extend(option, {
          dots: this.options.dots
        });
      } // Arrows


      if (typeof this.options.arrows !== 'undefined') {
        option = $.extend(option, {
          arrows: this.options.arrows
        });
      } // fade : true / false


      if (typeof this.options.fade !== 'undefined') {
        option = $.extend(option, {
          fade: this.options.fade
        });
      } // Autoplay


      if (typeof this.options.autoplay !== 'undefined') {
        option = $.extend(option, {
          autoplay: this.options.autoplay,
          autoplaySpeed: 3000
        });
      } // Control


      this.handle.slick(option);
      this.handle.on('beforeChange.' + pluginName, function () {
        that.zoomEffect(States.BEFORECHANGE);

        if ((typeof YT === "undefined" ? "undefined" : _typeof(YT)) === 'object') {
          that.element.find('[data-youtube]').youtube('pauseClip');
          that.element.find('[data-video]').video('pauseClip');
        }
      });
      this.handle.on('afterChange.' + pluginName, function () {
        that.setPositionArrows();
        that.zoomEffect(States.AFTERCHANGE); // Auto play after Paused youtube/video

        if ((typeof YT === "undefined" ? "undefined" : _typeof(YT)) === 'object') {
          $('.slick-current', that.element).find('[data-youtube]').youtube('playClip');
          $('.slick-current', that.element).find('[data-video]').video('playClip');
        }
      });
      this.hoverBulletEvent();
      this.setPositionArrows();
      this.slickNoSlide();
    },
    onInitSlick: function onInitSlick() {
      var that = this;
      this.zoomEffect();
      this.handle.off('click.currentItemEvents', '.slick-current').on('click.currentItemEvents', '.slick-current', function () {
        if (that.options.hasPopup && win.width() > 767) {
          that.turnOnPopup($(this));
          return false;
        }

        if (that.options.smoothZoom && win.width() < 768) {
          that.callSmoothZoom($(this).find('img').data('zoomImage'));
        }
      });
    },
    callSmoothZoom: function callSmoothZoom(imgSrc) {
      this.element.find('[data-pinchzoom]').pinchzoom('initialize', imgSrc);
    },
    turnOnPopup: function turnOnPopup(currentSlide) {
      $.fancybox.open(this.getGalleryList(currentSlide), {
        loop: false,
        slideShow: true,
        fullScreen: true,
        animationEffect: 'zoom',
        transitionEffect: 'circular',
        thumbs: true
      });
    },
    getGalleryList: function getGalleryList(currentSlide) {
      var galleryList = [],
          imgSrc,
          list = this.handle.find('.slick-slide').not('.slick-cloned').find('img'),
          currentImage = currentSlide.find('img').data('zoomImage'),
          obj;
      list.each(function () {
        obj = {};
        imgSrc = $(this).data('zoomImage');
        obj.src = imgSrc;

        if (imgSrc === currentImage) {
          galleryList.unshift(obj);
        } else {
          galleryList.push(obj);
        }
      });
      return galleryList;
    },
    zoomEffect: function zoomEffect(stateSlider) {
      if (this.options.hasZoom) {
        switch (stateSlider) {
          case States.BEFORECHANGE:
            $('.slick-current', this.element).zoomer('destroy');
            break;

          case States.AFTERCHANGE:
            $('.slick-current', this.element).zoomer('destroy');
            $('.slick-current', this.element).zoomer('init');
            break;

          case States.RESIZE:
            $('.slick-current', this.element).zoomer('destroy');
            $('.slick-current', this.element).zoomer('init');
            break;

          default:
            $('.slick-current', this.element).zoomer('init'); // First call zoomer of slider

            break;
        }
      }
    },
    hoverBulletEvent: function hoverBulletEvent() {
      if (this.options[pluginName].slideOnHover) {
        this.handle.find('.slick-dots').on('mouseenter.bullet', 'li', function () {
          $(this).trigger('click');
        });
      }
    },
    setPositionArrows: function setPositionArrows() {
      var arrowControl = this.handle.find('.slick-arrow'),
          imgVisible = this.handle.find('[aria-hidden="false"] .img-view'),
          maxHeight = 0,
          posTop = 0;

      if (this.options.setPositionArrows) {
        $(imgVisible).each(function () {
          maxHeight = Math.max($(this).height(), maxHeight);
        });
        posTop = maxHeight / 2;
        arrowControl.animate({
          'top': posTop
        }, 300);
      }
    },
    slickNoSlide: function slickNoSlide() {
      var getSlick = this.handle.slick('getSlick');

      if (getSlick.slideCount <= getSlick.options.slidesToShow) {
        this.element.addClass('no-slide');
      } else {
        this.element.removeClass('no-slide');
      }
    },
    slickPause: function slickPause() {
      this.handle.slickPause();
    },
    slickPlay: function slickPlay() {
      this.handle.slickPlay();
    },
    destroy: function destroy() {
      this.handle.slick('unslick').off('afterChange.' + pluginName);
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
    handle: '.slick',
    singleSlider: {
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      zIndex: 5,
      accessibility: false,
      // Disable Slide go to top on after change
      rtl: $('html').attr('dir') === 'rtl' ? true : false
    },
    carousel: {
      infinite: true,
      speed: 600,
      slidesToShow: 6,
      slidesToScroll: 2,
      // autoplay: true,
      // autoplaySpeed: 3000,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 4
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      }, {
        breakpoint: 544,
        settings: {
          slidesToShow: 2
        }
      }]
    },
    centerMode: {
      centerMode: true,
      slidesToShow: 1,
      focusOnSelect: false,
      centerPadding: '0',
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          centerPadding: '25%'
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: 0
        }
      }]
    },
    videoSlide: {
      centerMode: true,
      slidesToShow: 1,
      focusOnSelect: false,
      centerPadding: '0',
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          centerPadding: 0
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: 0
        }
      }]
    },
    sycingView: {
      speed: 600,
      slidesToShow: 1,
      infinite: false,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false
    },
    sycingThumb: {
      speed: 600,
      slidesToShow: 7,
      slidesToScroll: 1,
      centerPadding: 0,
      focusOnSelect: true,
      infinite: true,
      // autoplay: true,
      // autoplaySpeed: 3000,
      zIndex: 5,
      rtl: $('html').attr('dir') === 'rtl' ? true : false,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      }]
    },
    variableWidth: {
      speed: 600,
      variableWidth: true,
      slidesToScroll: 2,
      infinite: true,
      zIndex: 5
    },
    promotion: {
      speed: 600,
      slidesToShow: 4,
      slidesToScroll: 2,
      infinite: false,
      zIndex: 5,
      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }]
    },
    product: {
      speed: 600,
      slidesToShow: 7,
      slidesToScroll: 2,
      infinite: false,
      zIndex: 5,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 5
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 4
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 2
        }
      }]
    },
    pricingslide: {
      speed: 600,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      zIndex: 5
    },
    vertical: {
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      zIndex: 5
    },
    tworow: {
      rows: 2,
      slidesToShow: 2,
      slidesToScroll: 2,
      infinite: false,
      zIndex: 5
    },
    tworowproduct: {
      rows: 2,
      slidesToShow: 7,
      slidesToScroll: 2,
      infinite: false,
      zIndex: 5,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 5
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 4
        }
      }, {
        breakpoint: 544,
        settings: {
          slidesToShow: 2
        }
      }]
    }
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);
"use strict";

/**
 *  @name plugin
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

  var pluginName = 'zoomer',
      win = $(window),
      zoomTimer,
      resize = 'onorientationchange' in window ? 'orientationchange.resize' + pluginName : 'resize.resize' + pluginName;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.handle = this.element.find(this.options.handle);

      if (this.element.is(':visible') && win.width() > 767) {
        this.checkImgLoad();
      }

      win.off(resize).on(resize, function () {
        if (zoomTimer) {
          clearTimeout(zoomTimer);
        }

        zoomTimer = setTimeout(function () {
          if ($('[data-' + pluginName + ']').is(':visible') && win.width() > 767) {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
            $('[data-' + pluginName + ']')[pluginName]('init');
          } else {
            $('[data-' + pluginName + ']')[pluginName]('destroy');
          }
        }, 300);
      });
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
            $.isFunction(that.defineOption) && that.defineOption();
          }
        }).on('error.' + pluginName, function () {
          ++imagesLoaded;

          if (imagesLoaded === totalImages) {
            $.isFunction(that.defineOption) && that.defineOption();
          }
        });
      });
    },
    defineOption: function defineOption() {
      var windowZoom = {},
          that = this;
      this.option = {
        borderSize: 1,
        borderColour: '#ddd',
        cursor: 'crosshair',
        easing: true,
        loadingIcon: 'images/loading.svg',
        responsive: true,
        zoomType: 'inner',
        lensColour: '#fff',
        lensOpacity: 0.4,
        zoomId: this.options.zoomId,
        onDestroy: function onDestroy() {//console.log('onDestroy');
        },
        onImageClick: function onImageClick() {//console.log('onImageClick');
        },
        onShow: function onShow() {//console.log('onShow');
        },
        onZoomedImageLoaded: function onZoomedImageLoaded() {
          //console.log('onZoomedImageLoaded');
          that.element.addClass('zoomLoaded');
        },
        onImageSwap: function onImageSwap() {//console.log('onImageSwap');
        },
        onImageSwapComplete: function onImageSwapComplete() {//console.log('onImageSwapComplete');
        }
      };

      if (win.width() > 1023) {
        windowZoom = {
          zoomType: 'window',
          zoomWindowWidth: this.options.zoomWindowWidth,
          zoomWindowHeight: this.options.zoomWindowHeight,
          zoomWindowOffetx: this.options.zoomWindowOffetx,
          scrollZoom: true
        };
      }

      if (win.width() < 1024 && win.width() > 767) {
        // tablet
        windowZoom = {};
      }

      this.option = $.extend({}, this.option, windowZoom);
      this.initialized(this.option);
    },
    initialized: function initialized(opts) {
      this.handle.ezPlus(opts);
    },
    destroy: function destroy() {
      this.element.removeClass('zoomLoaded');
      this.handle.removeData('ezPlus');
      this.handle.removeData('zoomImage');
      this.handle.off('mouseleave mouseenter mouseover mousemove mouseout mousewheel touchend touchmove click DOMMouseScroll MozMousePixelScroll');
      $('.zoomContainer').filter('[uuid="' + this.options.zoomId + '"]').remove(); // $.removeData(this.element[0], pluginName);
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
    handle: '.zoomer',
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomWindowOffetx: 100
  };
  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });
})(jQuery, window);