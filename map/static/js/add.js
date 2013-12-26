var add = (function() {

    var showLoader = function() {
        $('.loader').show();
    };

    var hideLoader = function() {
        $('.loader').hide();
    };

    var getComponent = function(name, data) {
        var components = data.address_components;
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            for (var j = 0; j < component.types.length; j++) {
                var type = component.types[j];
                if (type == name) {
                    return component.long_name;
                }
            }
        }
        return null;
    };

    var Controller = function($scope, $rootScope) {
        var reset = function() {
            $scope.addBox = true;
            $scope.sugestionBoxOpen = false;
            $scope.place = {};
            $scope.rawGeocodingData = [];

            $scope.types = [{
                name: 'Startup',
                value: 'st'
            }, {
                name: 'Accelerator',
                value: 'ac'
            }, {
                name: 'Coworking',
                value: 'cw'
            }, {
                name: 'Investor',
                value: 'iv'
            }, {
                name: 'Incubator',
                value: 'ic'
            }, ];

            $scope.place.type = $scope.types[0];
        };

        reset();

        $scope.$on('gotAddressSugestions', function(ev, response) {
            $scope.rawGeocodingData = response;
            $scope.sugestions = [];
            if (response.length == 0) {
                $scope.sugestionBoxOpen = false;
                $scope.$apply();
                return;
            };
            for (var i = 0; i < response.results.length; i++) {
                var result = response.results[i];
                var address = result.formatted_address;
                if ($scope.sugestions.indexOf(address) == -1) {
                    $scope.sugestions.push({
                        index: i,
                        address: address
                    });
                }
            }
            if ($scope.sugestions.length > 0) {
                $scope.onSelection = $scope.sugestions[0];
                $scope.sugestionBoxOpen = true;
            }
        });

        $scope.clean = function() {
            setTimeout(function() {
                $scope.place.url = $scope.place.url.replace(/^(https?:\/\/https?:\/\/)/, 'http://');
                console.log($scope.place.url);
                $scope.$apply();
            }, 10);
        };

        $scope.validAddress = function() {
            if ($scope.place.address) {
                var address = $scope.place.address;
                if (address.number && address.lat && address.lng) {
                    return true;
                };
            }
            return false;
        };

        $scope.didSelectSugestion = function() {
            var data = $scope.rawGeocodingData.results[parseInt($scope.onSelection)];
            $scope.place.address = {
                formatted_address: data.formatted_address,
                lat: data.geometry.location.lat,
                lng: data.geometry.location.lng,
                city: getComponent('administrative_area_level_1', data),
                number: getComponent('street_number', data),
                street: getComponent('route', data),
            };
            $scope.sugestions = null;
            $scope.sugestionBoxOpen = false;
            $scope.$apply();
        };

        $scope.$on('clickedSugestion', function(ev, sugestion) {
            $scope.onSelection = sugestion;
            $scope.didSelectSugestion();
        });

        $scope.add = function() {
            if (!addForm.$invalid) {
                showLoader();
                var place = angular.copy($scope.place);
                place.type = place.type.value;
                place.city = place.address.city;
                place.number = place.address.number;
                place.street = place.address.street;
                place.lat = place.address.lat;
                place.lng = place.address.lng;
                delete place.address;
                $scope.httpPost('/api/add_place/', place, function(response) {
                    hideLoader();
                    $scope.addBox = false;
                });
            }
        };

        $scope.addAnother = function() {
            reset();
        };

        // This does not belong here
        $(document).keyup(function(ev) {
            if (!$scope.sugestionBoxOpen) {
                return
            }
            if (ev.keyCode == 13) {
                var currentElem = $('.modal').find('li.selected');
                $scope.onSelection = currentElem.find('input[type="hidden"]').val();
                $scope.didSelectSugestion();
                ev.preventDefault();
                return;
            }
            if (ev.keyCode == 38 || ev.keyCode == 40) {
                var currentElem = $('.modal').find('li.selected');
                currentElem.removeClass('selected');
                switch (ev.keyCode) {
                    case 38:
                        var selected = currentElem.prev();
                        break;
                    case 40:
                        var selected = currentElem.next();
                        break;
                }
                if (selected && selected.length > 0) {
                    currentElem = selected;
                }
                currentElem.addClass('selected');
                $scope.onSelection = currentElem.find('input[type="hidden"]').val();
                ev.preventDefault();
            }
        });

    };

    return {
        Controller: Controller
    };
})();
