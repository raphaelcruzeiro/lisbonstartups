
console.log('Directives');

var map = null;

app.directive('ngMap', function(){
    var obj = {
        compile: function(element, attrs) {
            return function(scope, elem, attrs){
                var latlng = new google.maps.LatLng(38.73717087503241, -9.209639143310595);
                var opt = {
                    zoom: 13,
                    center: latlng,
                    disableDefaultUI: true
                };
                map = new google.maps.Map(elem[0], opt);
                map.set('styles', [
                    {
                        "featureType": "all",
                        "elementType": "all",
                        "stylers": [
                            {
                                "invert_lightness": false
                            },
                            {
                                "saturation": 8
                            },
                            {
                                "lightness": 50
                            },
                            {
                                "gamma": 0.5
                            },
                            {
                                "hue": "#ffff00"
                            }
                        ]
                    },{
                        "featureType": "transit.station",
                        "elementType": "labels.icon",
                        "stylers": [
                          { "hue": "#ff0000" }
                        ]
                      },

                    // {
                    //     "featureType": "road.highway",
                    //     "stylers": [
                    //       { "color": "#2e5522" }
                    //     ]
                    //   },
                    {
                        "featureType": "water",
                        "stylers": [
                            { "color": "#33aabb" }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "poi.government",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "poi.medical",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "poi.place_of_worship",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "poi.school",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "poi.sports_complex",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      },{
                        "featureType": "transit.line",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                      }
                ]);
            };
        }
    };
    return obj;
});

app.directive('ngAddressAutocomplete', function($rootScope){
    var obj = {
        compile: function(element, attrs) {
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?address={address}&components=country:PT&sensor=false';
            var prev = null;
            return function(scope, elem, attrs){
                elem.keyup(function(ev) {
                    var str = $(this).val();
                    if (str.length < 4) {
                        $rootScope.$broadcast('gotAddressSugestions', []);
                        return;
                    }
                    if (str == prev) {
                        return;
                    }
                    prev = str;
                    var component = encodeURI(str);
                    var serviceCall = url.replace('{address}', component);
                    scope.httpGet(serviceCall, null, function(response) {
                        $rootScope.$broadcast('gotAddressSugestions', response);
                    });
                });
                elem.blur(function() {
                    setTimeout(function(){
                        $rootScope.$broadcast('gotAddressSugestions', []);
                    }, 200);
                });
            };
        }
    };
    return obj;
});

app.directive('ngSelect', function($rootScope){
    var obj = {
        compile: function(element, attrs) {
            return function(scope, elem, attrs){
                elem.click(function(ev) {
                    ev.preventDefault();
                    $rootScope.$broadcast('clickedSugestion', elem.find('input[type="hidden"]').val());
                })
            };
        }
    };
    return obj;
});

app.directive('ngCloseModal', function($rootScope){
    var obj = {
        compile: function(element, attrs) {
            return function(scope, elem, attrs){
                elem.click(function(ev) {
                    ev.preventDefault();
                    $('.modal-blocker').fadeOut();
                })
            };
        }
    };
    return obj;
});

app.directive('ngShowModal', function($rootScope){
    var obj = {
        compile: function(element, attrs) {
            return function(scope, elem, attrs){
                elem.click(function(ev) {
                    ev.preventDefault();
                    $('.modal-blocker').fadeIn();
                })
            };
        }
    };
    return obj;
});

