var mapModule = (function() {
    var iconPath = '/static/imgs/';

    var icons = [{
        type: 'st',
        path: [iconPath, 'marker-startup.png'].join('')
    }, {
        type: 'ac',
        path: [iconPath, 'marker-accelerator.png'].join('')
    }, {
        type: 'cw',
        path: [iconPath, 'marker-coworking.png'].join('')
    }, {
        type: 'iv',
        path: [iconPath, 'marker-investor.png'].join('')
    }, {
        type: 'ic',
        path: [iconPath, 'marker-incubator.png'].join('')
    }, {
        type: 'ev',
        path: [iconPath, 'marker-event.png'].join('')
    }];

    var Controller = function($scope, $rootScope, $location) {
        $scope.places = null;
        $scope.onMap = [];
        $scope.markers = [];

        $scope.filters = {
            st: true,
            ac: true,
            cw: true,
            iv: true,
            ic: true,
            ev: true
        };

        $scope.startups = true;
        $scope.accelerators = true;
        $scope.coworking = true;
        $scope.investors = true;
        $scope.incubators = true;
        $scope.events = true;

        $scope.counts = {
            st: 0,
            ac: 0,
            cw: 0,
            iv: 0,
            ic: 0,
            ev: 0
        };

        var infoWindow = new google.maps.InfoWindow({
            width: 400,
            height: 520
        });

        var getPlaceById = function(id) {
            return _.find($scope.places, function(place) {
                return place.id == id;
            });
        };

        var shouldChangePos = function(latLng) {
            return _.some($scope.markers, function(marker) {
                var pos = marker.getPosition();
                return pos.lat() == latLng.lat() && pos.lng() == latLng.lng();
            });
        };

        var computeCount = function() {
            var keys = ['st', 'cw', 'ac', 'iv', 'ic', 'ev'];
            var counts = _.countBy($scope.places, function(place) {
                return place.type;
            });
            _.each(_.keys(counts), function(key) {
                $scope.counts[key] = counts[key];
            });
        };

        registerOmsEvent('spiderfy', function(markers) {
            infoWindow.close();
        });


        registerOmsEvent('click', function(marker, event) {
            infoWindow.close();
            var place = getPlaceById(marker.placeId);
            var content = '<div class="infowindow-content">' +
                '<h3>' + place.name + '</h3>' +
                '<div class="description">' +
                place.description +
                '</div>' +
                '<a href="' + place.url + '">' + place.url + '</a>' +
                '</div>';
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });

        var addPlaceToMap = function(place) {
            $scope.onMap.push(place);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(place.address.lat, place.address.lng),
                title: place.name,
                animation: google.maps.Animation.DROP,
                icon: _.findWhere(icons, {
                    type: place.type
                }).path,
                map: map
            });

            if (place.type == 'ac' || place.type == 'cw' || place.type == 'ic') {
                marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1)
            }

            while (shouldChangePos(marker.getPosition())) {
                var pos = marker.getPosition();
                marker.setPosition(new google.maps.LatLng(pos.lat() + 0.0000005, pos.lng() + 0.0000005));
            }

            marker.placeId = place.id;
            $scope.markers.push(marker);
            oms.addMarker(marker);
        };

        var clearMarkers = function() {
            onMap = [];
            _.each($scope.markers, function(marker) {
                marker.setMap(null);
            });
        };

        $scope.filter = function() {
            setTimeout(function() {
                clearMarkers();
                var active = _.chain($scope.filters).pairs().filter(
                    function(filter) {
                        return filter[1] == true;
                    }).map(function(item) {
                    return item[0];
                }).value();
                _.chain($scope.places).filter(function(place) {
                    return _.contains(active, place.type);
                }).each(addPlaceToMap);
            }, 200);
        };

        $scope.httpGet('/api/places/', null, function(response) {
            $scope.places = response;
            _.each(response, function(current) {
                addPlaceToMap(current);
            });
            computeCount();
        });

    };

    return {
        Controller: Controller
    };
})();
