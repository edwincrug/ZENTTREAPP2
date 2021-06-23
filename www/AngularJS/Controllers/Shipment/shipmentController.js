appControllers.controller('shipmentController', ['$scope', '$rootScope', '$state', 'listEnvios', 'shipmentRepository', 'alertFactory', 'clientDBO', function($scope, $rootScope, $state, listEnvios, shipmentRepository, alertFactory, clientDBO) {

    $scope.model = this;

    $scope.model.envios = listEnvios.data;
    $rootScope.model.badgeEnvios = $scope.model.envios.length;

    //Agrego un watch para gestionar los cambios de estado
    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.listEnvios', function(listEnvios) {
        if (listEnvios != null) {
            $scope.model.envios = listEnvios.data;
            $rootScope.model.badgeEnvios = $scope.model.envios.length;
        }
    });

    // Recarga los envíos
    $scope.doRefresh = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                shipmentRepository.getEnvios(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $scope.model.envios = response.data;
                        $rootScope.model.badgeEnvios = $scope.model.envios.length;
                        $scope.$broadcast('scroll.refreshComplete');
                    }, function errorCallback(err) {
                        //OnError
                        console.log(err);
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });
    };

    //Voy a la pantalla de recoger correspondencia
    $scope.DetalleEnvio = function(paq) {
        $state.go('tabsController.enviosDetalle', {
            envioObj: paq
        }, {
            reload: true
        });
    };

}]);
