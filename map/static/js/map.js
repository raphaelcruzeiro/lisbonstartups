
var map = (function(){
    var Controller = function($scope, $rootScope, $location) {
        $scope.places = null;
        $scope.markers = [];

        $scope.httpGet('/api/places/', null, function(response) {
            $scope.places = response;
            for (var i = 0; i < response.length; i++) {
                var current = response[i];
                $scope.markers.push(new google.maps.Marker({
                    position: new google.maps.LatLng(current.address.lat, current.address.lng),
                    title: current.name,
                    map: map
                }));
            }
        });

    };

    return {
        Controller: Controller
    };
})();
