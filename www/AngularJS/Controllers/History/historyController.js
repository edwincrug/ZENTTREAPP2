appControllers.controller('historyController', ['$scope', '$rootScope', '$state', 'listReservacion', 'listCorrespondencia', 'listEnvio', 'reservationRepository', 'messagingRepository', 'shipmentRepository', 'alertFactory', 'clientDBO', function ($scope, $rootScope, $state, listReservacion, listCorrespondencia, listEnvio, reservationRepository, messagingRepository, shipmentRepository, alertFactory, clientDBO) {

    $scope.model = this;

    $scope.model.histReservacion = listReservacion.data;
    $scope.model.histCorrespondencia = listCorrespondencia.data;
    $scope.model.histEnvio = listEnvio.data;

    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.listReservacion', function (listReservacion) {
        if (listReservacion != null)
            $scope.model.histReservacion = listReservacion.data;
    });

    $scope.$watch('$state.$current.locals.globals.listCorrespondencia', function (listCorrespondencia) {
        if (listCorrespondencia != null)
            $scope.model.histCorrespondencia = listCorrespondencia.data;
    });

    $scope.$watch('$state.$current.locals.globals.listEnvio', function (listEnvio) {
        if (listEnvio != null)
            $scope.model.histEnvio = listEnvio.data;
    });

    $scope.model.view = 1;

    // Cambia de vista
    $scope.ChangeView = function (param) {
        $scope.model.view = param;
    };

    // Cargo la lista de reservaciones
    $scope.doRefresh = function (type) {
        clientDBO.get()
            .then(function successCallback(data) {
                //Reservaciones
                reservationRepository.getPasadas(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $scope.model.histReservacion = response.data;
                        //Correspondencia
                        messagingRepository.getHistorico(data[0].idActa)
                            .then(function successCallback(response) {
                                //OnSuccess
                                $scope.model.histCorrespondencia = response.data;
                                //Envios
                                shipmentRepository.getHistorico(data[0].idActa)
                                    .then(function successCallback(response) {
                                        //OnSuccess
                                        $scope.$broadcast('scroll.refreshComplete');
                                        $scope.model.histEnvio = response.data;

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

    // Abre el historico de reservaciones
    $scope.VerReservacion = function (res) {
        $state.go('reservacionesHistorico', {
            reservationObj: res
        }, {
            reload: true
        });
    };

    // Albre el Historico de correspondencia
    $scope.VerCorrespondencia = function (paq) {
        $state.go('correspondenciaHistorico', {
            paqueteObj: paq
        }, {
            reload: true
        });
    };

    // Abre el historico de envípos
    $scope.VerEnvio = function (env) {
        $state.go('envioHistorico', {
            envioObj: env
        }, {
            reload: true
        });
    };


}]);
