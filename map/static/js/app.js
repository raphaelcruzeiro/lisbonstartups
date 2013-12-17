
angular.module('lisbonstartups', ['ngRoute', 'ngSanitize', 'ngAnimate']);

var app = angular.module('lisbonstartups').config(function($httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();
    $httpProvider.defaults.headers.post['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';
});

app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
}]);

app.run(function($rootScope, $http){
    $rootScope.httpPost = function(url, data, callback, errorCallback) {
        var _data = data != null ? $.param(data) : null;
        $http({
            method: 'post',
            data: _data,
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(callback).
            error(function(data, status) {
                if (errorCallback) {
                    errorCallback(data, status);
                }
                console.log(status);
            });
    };

    $rootScope.httpGet = function(url, data, callback, errorCallback) {
        var _data = data != null ? $.param(data) : null;
        $http({
            method: 'get',
            data: _data,
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(callback).
            error(function(data, status) {
                if (errorCallback) {
                    errorCallback(data, status);
                }
                console.log(status);
            });
    };
});
