
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
            for (var i = 0; i < $scope.places.length; i++) {
                if ($scope.places[i].id == id) {
                    return $scope.places[i];
                }
            }
            return null;
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
            marker.placeId = place.id;
            $scope.markers.push(marker);
            google.maps.event.addListener(marker, 'click', function() {
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
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
        };

        $scope.filter = function() {
            setTimeout(function(){
                clearMarkers();
                for (var i = 0; i < $scope.places.length; i++) {
                    if (isInFilter($scope.places[i])) {
                        addPlaceToMap($scope.places[i]);
                    }
                }
            }, 200);
        };

        $scope.httpGet('/api/places/', null, function(response) {
            $scope.places = response;
            for (var i = 0; i < response.length; i++) {
                var current = response[i];
                computeCount(current);
                addPlaceToMap(current);
            }
        });

    };

    return {
        Controller: Controller
    };
})();
