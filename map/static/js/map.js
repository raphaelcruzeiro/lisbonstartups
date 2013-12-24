
var map = (function(){
    var iconPath = '/static/imgs/';
    var Controller = function($scope, $rootScope, $location) {
        $scope.places = null;
        $scope.onMap = [];
        $scope.markers = [];

        $scope.startups = true;
        $scope.accelerators = true;
        $scope.coworking = true;
        $scope.investors = true;
        $scope.incubators = true;
        $scope.events = true;

        $scope.startupCount = 0;
        $scope.acceleratorCount = 0;
        $scope.coworkingCount = 0;
        $scope.investorCount = 0;
        $scope.incubatorCount = 0;
        $scope.eventCount = 0;

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

        var computeCount = function(place) {
            if (place.type == 'st') {
                $scope.startupCount++;
            }
            else if (place.type == 'ac') {
                $scope.acceleratorCount++;
            }
            else if (place.type == 'cw') {
                $scope.coworkingCount++;
            }
            else if (place.type == 'iv') {
                $scope.investorCount++;
            }
            else if (place.type == 'ic') {
                $scope.incubatorCount++;
            }
            else if (place.type == 'ev') {
                $scope.eventCount++;
            }
        };

        registerOmsEvent('click', function(marker, event) {
            var place = getPlaceById(marker.placeId);
            var content = '<div class="infowindow-content">' +
            '<h3>' + place.name + '</h3>' +
            '<div class="description">' +
            place.description +
            '</div>' +
            '<a href="' + place.url + '">' + place.url + '</a>' +
            '</div>';
            new google.maps.InfoWindow({
                content: content,
                width: 400,
                height: 520
            }).open(map, marker);
        });

        var addPlaceToMap = function(place) {
            $scope.onMap.push(place);
            var icon = iconPath;
            if (place.type == 'st') {
                icon += 'marker-startup.png';
            }
            else if (place.type == 'ac') {
                icon += 'marker-accelerator.png';
            }
            else if (place.type == 'cw') {
                icon += 'marker-coworking.png';
            }
            else if (place.type == 'iv') {
                icon += 'marker-investor.png';
            }
            else if (place.type == 'ic') {
                icon += 'marker-incubator.png';
            }
            else if (place.type == 'ev') {
                icon += 'marker-event.png';
            }
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(place.address.lat, place.address.lng),
                title: place.name,
                animation: google.maps.Animation.DROP,
                icon: icon,
                map: map
            });

            if (place.type == 'ac' || place.type == 'cw' || place.type == 'ic') {
                marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1)
            }

            while(shouldChangePos(marker.getPosition())) {
                var pos = marker.getPosition();
                marker.setPosition(new google.maps.LatLng(pos.lat() + 0.0000005, pos.lng() + 0.0000005));
            }

            marker.placeId = place.id;
            $scope.markers.push(marker);
            oms.addMarker(marker);
        };

        var isInFilter = function(place) {
            if ($scope.startups && place.type == 'st') {
                return true;
            }
            if ($scope.accelerators && place.type == 'ac') {
                return true;
            }
            if ($scope.coworking && place.type == 'cw') {
                return true;
            }
            if ($scope.investors && place.type == 'iv') {
                return true;
            }
            if ($scope.incubators && place.type == 'ic') {
                return true;
            }
            if ($scope.events && place.type == 'ev') {
                return true;
            }
            return false;
        };

        var clearMarkers = function() {
            onMap = [];
            _.each($scope.markers, function(marker) {
                marker.setMap(null);
            });
        };

        $scope.filter = function() {
            setTimeout(function(){
                clearMarkers();
                _.each(_.filter($scope.places, isInFilter), addPlaceToMap);
            }, 200);
        };

        $scope.httpGet('/api/places/', null, function(response) {
            $scope.places = response;
            _.each(response, function(current) {
                computeCount(current);
                addPlaceToMap(current);
            });
        });

    };

    return {
        Controller: Controller
    };
})();
