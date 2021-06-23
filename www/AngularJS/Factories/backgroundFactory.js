appServices.factory('backgroundFactory', function($ionicPlatform) {
    var service = {};
    var inBackground = false;

    $ionicPlatform.ready(function() {
        document.addEventListener("resume", function() { inBackground = false; }, false);
        document.addEventListener("pause", function() { inBackground = true; }, false);
    });

    service.isActive = function() {
        return inBackground == false;
    }
    return service;
})
