
var add = (function(){
    var getComponent = function(name, data) {
        var components = data.address_components;
        for(var i = 0; i < components.length; i++) {
            var component = components[i];
            for(var j = 0; j < component.types.length; j++) {
                var type = component.types[j];
                if(type == name) {
                    return component.long_name;
                }
            }
        }
        return null;
    };

    var join = function(str1, str2) {
        var result = '';
        if (str1) {
            result += str1;
        }
        if (str1 && str2) {
            result += ', ';
        }
        if(str2) {
            result += str2;
        }
        return result;
    }

    var Controller = function($scope, $rootScope) {
        $scope.sugestionBoxOpen = false;

        $scope.types = [
            { name: 'Startup', value: 'st' },
            { name: 'Accelerator', value: 'ac' },
            { name: 'Coworking', value: 'cw' },
        ];

        $scope.type = $scope.types[0];

        $scope.$on('gotAddressSugestions', function(ev, response) {
            $scope.sugestions = [];
            if (response.length == 0) {
                $scope.sugestionBoxOpen = false;
                $scope.$apply();
                return;
            };
            for(var i = 0; i < response.results.length; i++) {
                var address = '';
                var result = response.results[i];
                address += join('', getComponent('route', result));
                if (/\d/.test($scope.address)) {
                    address = join(address, getComponent('street_number', result));
                }
                address = join(address, getComponent('administrative_area_level_1', result));
                if ($scope.sugestions.indexOf(address) == -1) {
                    $scope.sugestions.push(address);
                }
            }
            if($scope.sugestions.length > 0) {
                $scope.onSelection = $scope.sugestions[0];
                $scope.sugestionBoxOpen = true;
            }
        });

        $scope.didSelectSugestion = function() {
            $scope.address = $scope.onSelection;
            $scope.sugestions = null;
            $scope.sugestionBoxOpen = false;
            $scope.$apply();
        };

        $scope.$on('clickedSugestion', function(ev, sugestion) {
            $scope.onSelection = sugestion;
            $scope.didSelectSugestion();
        });

        // This does not belong here
        $(document).keyup(function(ev) {
            if (!$scope.sugestionBoxOpen) {
                return
            };
            if (ev.keyCode == 13) {
                $scope.didSelectSugestion();
                ev.preventDefault();
                return;
            }
            if (ev.keyCode == 38 || ev.keyCode == 40) {
                var currentElem = $('.modal').find('li.selected');
                currentElem.removeClass('selected');
                switch(ev.keyCode) {
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
                $scope.onSelection = currentElem.find('span').html();
                ev.preventDefault();
            }
        });

    };

    return {
        Controller: Controller
    };
})();
