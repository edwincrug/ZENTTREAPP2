appControllers.controller('reservationController', ['$scope', '$rootScope', '$state', 'listPendientes', 'listActuales', 'reservationRepository', 'alertFactory', 'clientDBO', 'sessionDBO', function($scope, $rootScope, $state, listPendientes, listActuales, reservationRepository, alertFactory, clientDBO, sessionDBO) {

    $scope.model = this;
    //$rootScope.model = this;

    //Método que actualiza la lista al arrastrar
    $scope.doRefresh = function() {

        //Obtengo los datos del usuario logueado
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $scope.cliente = data[0];
                //Actualizo la lista de reservaciones
                reservationRepository.getActuales($scope.cliente.idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $scope.model.actuales = response.data;
                        reservationRepository.getPendientes($scope.cliente.idActa)
                            .then(function successCallback(response) {
                                //OnSuccess
                                $scope.model.pendientes = response.data;
                                $rootScope.model.badgeReservation = $scope.model.pendientes.length;
                                $scope.$broadcast('scroll.refreshComplete');
                            }, function errorCallback(response) {
                                //OnError
                                $scope.$broadcast('scroll.refreshComplete');
                                alertFactory.message('Error', 'No se pudieron obtener las reservaciones pendientes');
                            });

                    }, function errorCallback(response) {
                        //OnError
                        $scope.$broadcast('scroll.refreshComplete');
                        alertFactory.message('Error', 'No se pudieron obtener las reservaciones actuales');

                    });

            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });
    };

    //Asigno las listas de pendientes
    $scope.model.pendientes = listPendientes.data;
    $rootScope.model.badgeReservation = $scope.model.pendientes.length;

    $scope.model.actuales = listActuales.data;

    //Agrego un watch para gestionar los cambios de estado
    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.listPendientes', function(listPendientes) {
        if (listPendientes != null) {
            $scope.model.pendientes = listPendientes.data;
            $rootScope.model.badgeReservation = $scope.model.pendientes.length;
        }
    });

    $scope.$watch('$state.$current.locals.globals.listActuales', function(listActuales) {
        if (listActuales != null)
            $scope.model.actuales = listActuales.data;
    });


    //Botón nueva reservación
    $scope.NuevaReservacion = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $state.go('tabsController.reservar', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                alertFactory.message('Error', 'Error al obtener el cliente logueado.');
                $state.go('login');
            });

    };

    // Botón ver reservación
    $scope.VerReservacionAgendada = function(res) {
        $state.go('tabsController.reservacionesAccion', {
            reservationObj: res,
            estado: 1
        }, {
            reload: true
        });
    };

    // Botón ver reservación
    $scope.VerReservacionIniciada = function(res) {
        $state.go('tabsController.reservacionesAccion', {
            reservationObj: res,
            estado: 2
        }, {
            reload: true
        });
    };


}]);
