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
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'gmap',
    body = $('body'),
    win = $(window),
    styles =[
      {
        'featureType':'administrative',
        'elementType':'labels.text.fill',
        'stylers':[
          {
            'color':'#444444'
          }
        ]
      },
      {
        'featureType':'landscape',
        'elementType':'all',
        'stylers':[
          {
            'color':'#f2f2f2'
          }
        ]
      },
      {
        'featureType':'poi',
        'elementType':'all',
        'stylers':[
          {
            'visibility':'on'
          }
        ]
      },
      {
        'featureType':'poi',
        'elementType':'geometry.stroke',
        'stylers':[
          {
            'lightness':'1'
          }
        ]
      },
      {
        'featureType':'poi',
        'elementType':'labels',
        'stylers':[
          {
            'visibility':'off'
          }
        ]
      },
      {
        'featureType':'road',
        'elementType':'all',
        'stylers':[
          {
            'saturation':-100
          },
          {
            'lightness':45
          }
        ]
      },
      {
        'featureType':'road.highway',
        'elementType':'all',
        'stylers':[
          {
            'visibility':'simplified'
          }
        ]
      },
      {
        'featureType':'road.arterial',
        'elementType':'labels.icon',
        'stylers':[
          {
            'visibility':'off'
          }
        ]
      },
      {
        'featureType':'transit',
        'elementType':'all',
        'stylers':[
          {
            'visibility':'off'
          }
        ]
      },
      {
        'featureType':'transit.station.bus',
        'elementType':'all',
        'stylers':[
          {
            'visibility':'on'
          }
        ]
      },
      {
        'featureType':'transit.station.bus',
        'elementType':'labels.text.fill',
        'stylers':[
          {
            'saturation':'0'
          },
          {
            'lightness':'0'
          },
          {
            'gamma':'1.00'
          },
          {
            'weight':'1'
          }
        ]
      },
      {
        'featureType':'transit.station.bus',
        'elementType':'labels.icon',
        'stylers':[
          {
            'saturation':'-100'
          },
          {
            'weight':'1'
          },
          {
            'lightness':'0'
          }
        ]
      },
      {
        'featureType':'transit.station.rail',
        'elementType':'all',
        'stylers':[
          {
            'visibility':'on'
          }
        ]
      },
      {
        'featureType':'transit.station.rail',
        'elementType':'labels.text.fill',
        'stylers':[
          {
            'gamma':'1'
          },
          {
            'lightness':'40'
          }
        ]
      },
      {
        'featureType':'transit.station.rail',
        'elementType':'labels.icon',
        'stylers':[
          {
            'saturation':'-100'
          },
          {
            'lightness':'30'
          }
        ]
      }
    ];

  var setScrollMap = function(isScroll) {
    if (this.vars.map) {
      this.vars.map.setOptions({scrollwheel: isScroll});
    }
  };

  var checkScrollMap = function() {
    var that = this;
    google.maps.event.addDomListener(document.getElementById(this.options.id), 'click', function() {
      setScrollMap.call(that, true);
    });
    google.maps.event.addDomListener(document.getElementById(this.options.id).childNodes, 'click', function() {
      setScrollMap.call(that, true);
    });
    google.maps.event.addListener(that.vars.map, 'mousedown', function(){
      setScrollMap.call(that, true);
    });
    body.on('mousedown.' + pluginName, function(e) {
      if (!$(e.target).closest('#' + that.options.id).length) {
        setScrollMap.call(that, false);
      }
    });
    win.on('scroll.' + pluginName, function() {
      setScrollMap.call(that, false);
    });
  };

  var changeZoom = function() {
    var that = this;
    this.vars.map.addListener('zoom_changed', function() {
      that.vars.zoomchanged = that.vars.map.getZoom();
    });
  };

  var initAutocomplete = function() {
    var that = this;
    var input = document.getElementById(this.options.input);
    if(input) {
      var searchBox = new google.maps.places.SearchBox(input);
      this.vars.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      this.vars.map.addListener('bounds_changed', function() {
        searchBox.setBounds(that.vars.map.getBounds());
      });

      var markers = [];
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var infos;

        if (places.length === 0) {
          return;
        }

        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        places.forEach(function(place, i) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchoPoint: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: that.vars.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          infos = '<strong style="display: block; text-align: center;">' + place.name + '</strong>' + place.formatted_address;

          google.maps.event.addListener(markers[i], 'click', function() {
            that.setCenter(markers[i]);
            that.showInfoWindow(markers[i], '<div class="noscrollbar">' + infos + '</>');
          });

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        changeZoom.call(that);
        that.vars.map.fitBounds(bounds);
      });
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options, this.element.data(pluginName));
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.vars = {};
      this.vars.marker = [],
      this.vars.locations = locations;
      this.vars.optMap = {
        center: {lat: this.vars.locations[0].lat, lng: this.vars.locations[0].lng},
        zoom: this.options.zoom[0],
        styles: styles,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.DEFAULT,
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        panControl: false,
        scrollwheel: false,
        //draggable: Modernizr.mobile || Modernizr.tablet ? false : true,
        gestureHandling: 'cooperative'
      };

      this.initGmap();
    },
    initGmap: function() {
      this.vars.map = new google.maps.Map(document.getElementById(this.options.id), this.vars.optMap);

      this.setMarkers();
      this.listener();
    },
    listener: function() {
      checkScrollMap.call(this);
      initAutocomplete.call(this);
      this.changeLocation(this.vars.locations, this.options.initValue);
    },
    setMarkers: function() {
      var that = this,
        position;
        this.vars.bound = new google.maps.LatLngBounds();

      this.vars.infowindow = new google.maps.InfoWindow();
      for (var i = 0, n = this.vars.locations.length; i < n; ++i) {
        that.vars.icon = {
          url: that.vars.locations[i].marker || that.options.icon //https://developers.google.com/maps/documentation/javascript/examples/icon-complex
        };
        this.vars.bound.extend(new google.maps.LatLng(that.vars.locations[i].lat, that.vars.locations[i].lng));
        position = new google.maps.LatLng(that.vars.locations[i].lat, that.vars.locations[i].lng);

        that.vars.marker[i] = new google.maps.Marker({
          position: position,
          title: that.vars.locations[i].name,
          map: that.vars.map,
          icon: that.vars.icon,
          animation: google.maps.Animation.DROP //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        });

        google.maps.event.addListener(that.vars.marker[i], 'click', (function(marker, mess) {
          return function() {
            changeZoom.call(that);
            that.setCenter(marker);
            that.showInfoWindow(marker, mess);
            $('#' + that.options.dropdown).val(marker.title);
            $('#' + that.options.dropdown).closest('[data-select]').addClass('selected').find('span').html(marker.title);
          };
        })(that.vars.marker[i], this.vars.locations[i].mess));
      }
      this.boundAllPosition();
    },
    boundAllPosition: function() {
      this.vars.map.setCenter(this.vars.bound.getCenter());
      this.vars.map.fitBounds(this.vars.bound);
    },
    changeLocation: function(locations, initValue) {
      var that = this,
        opt = '';
      for (var i = 0, n = locations.length; i < n; ++i) {
        if(initValue === locations[i].name) {
          opt = '<option value="' + locations[i].name + '" selected="selected">' + locations[i].name + '</option>';
        }
        else {
          opt = '<option value="' + locations[i].name + '">' + locations[i].name + '</option>';
        }
        $('#' + this.options.dropdown).append(opt);
      }

      $('#' + this.options.dropdown).on('change.' + pluginName, function() {
        var name = $(this).val();
        for (var i = 0, n = that.vars.locations.length; i < n; ++i) {
          if(name === that.vars.locations[i].name) {
            google.maps.event.trigger(that.vars.marker[i], 'click');
          }
        }
        if(!name) {
          that.boundAllPosition();
          that.vars.infowindow.close();
          that.vars.zoomchanged = undefined;
        }
      });//.change();
      google.maps.event.addListenerOnce(this.vars.map, 'idle', function() {
        $('#' + that.options.dropdown).change();
      });
    },
    setCenter: function(marker) {
      var zoomchanged = this.options.zoom[1];
      if(!!this.vars.zoomchanged) {
        zoomchanged = this.vars.zoomchanged;
      }
      this.vars.map.setZoom(zoomchanged);
      this.vars.map.panTo(marker.getPosition());
    },
    showInfoWindow: function(marker, mess) {
      this.vars.infowindow.setContent(mess);
      this.vars.infowindow.open(this.vars.map, marker);
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
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
      icon: 'images/pink-marker.png'
    });
  });

}(jQuery, window));
