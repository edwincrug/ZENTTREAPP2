appControllers.controller('messagingController', ['$scope', '$rootScope', '$state', 'listCorrespondencia', 'messagingRepository', 'alertFactory', 'clientDBO',  function($scope, $rootScope, $state, listCorrespondencia, messagingRepository, alertFactory, clientDBO) {

    $scope.model = this;

    $scope.model.almacen = listCorrespondencia.data;
    $rootScope.model.badgeAlmacen = $scope.model.almacen.length;

    //Agrego un watch para gestionar los cambios de estado
    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.listCorrespondencia', function(listCorrespondencia) {
        if (listCorrespondencia != null) {
            $scope.model.almacen = listCorrespondencia.data;
            $rootScope.model.badgeAlmacen = $scope.model.almacen.length;
        }
    });

    // Cargo la lista de reservaciones
    $scope.doRefresh = function(type) {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                messagingRepository.getAlmacen(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.model.almacen = response.data;
                        $rootScope.model.badgeAlmacen = $scope.model.almacen.length;
                    }, function errorCallback(err) {
                        //OnError
                        $scope.$broadcast('scroll.refreshComplete');
                        console.log(err);
                    });
            }, function errorCallback(err) {
                //OnError
                $scope.$broadcast('scroll.refreshComplete');
                console.log(err);
            });

    };


    //Voy a la pantalla de recoger correspondencia
    $scope.RecogerCorrespondencia = function(env, type) {
        $state.go('tabsController.correspondenciaDetalle', {
            paqueteObj: env
        }, {
            reload: true
        });
    };

    //Voy a la pantalla de recoger correspondencia
    $scope.Escanear = function(cor) {

    };

}]);
