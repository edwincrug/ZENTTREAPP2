appControllers.controller('menuController', function($scope, $rootScope, $ionicHistory, $state, $filter, alertFactory, sessionFactory, clientDBO, reservationRepository, messagingRepository, mailRepository, shipmentRepository) {
    //Asigno el valor del badge
    $rootScope.model = this;

    //Obtengo el badge de reservaciones
    console.log('Empezando consulta');
    clientDBO.get()
        .then(function successCallback(data) {
            if (data.length > 0) {
                reservationRepository.getPendientes(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $rootScope.model.badgeReservation = response.data.length;
                    }, function errorCallback(response) {
                        //OnError
                        alertFactory.message('Error', 'No se pudieron obtener las reservaciones pendientes');
                    });
            }
        }, function errorCallback(err) {
             //OnError
            console.log(err);
        });

    //Obtengo el badge de mail
    clientDBO.get()
        .then(function successCallback(data) {
            if (data.length > 0) {
                mailRepository.getBuzon(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $rootScope.model.badgeMail = $filter('filter')(response.data, { unread: 1 }).length;
                        var x = 0;
                    }, function errorCallback(err) {
                        //OnError
                        console.log(err);
                    });
            }
        }, function errorCallback(err) {
            //OnError
            console.log(err);
        });

    //Obtengo el badge de correspondencia
    clientDBO.get()
        .then(function successCallback(data) {
            if (data.length > 0) {
                messagingRepository.getAlmacen(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $rootScope.model.badgeAlmacen = response.data.length;
                    }, function errorCallback(err) {
                        //OnError
                        console.log(err);
                    });
            }
        }, function errorCallback(err) {
            //OnError
            console.log(err);
        });

    //Obtengo el badge de envios
    clientDBO.get()
        .then(function successCallback(data) {
            if (data.length > 0) {
                shipmentRepository.getEnvios(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $rootScope.model.badgeEnvios = response.data.length;
                    }, function errorCallback(err) {
                        //OnError
                        console.log(err);
                    });
            }
        }, function errorCallback(err) {
            //OnError
            console.log(err);
        });

    // Redirige hacia la pantalla de Inicio
    $scope.Inicio = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                $state.go('tabsController.reservaciones', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });

    };

    $scope.Buzon = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $state.go('tabsController.buzon', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };

    $scope.Correspondencia = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $state.go('tabsController.correspondencia', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };


    $scope.Envios = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $state.go('tabsController.envios', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };


    $scope.Consultas = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('consultas', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };

    $scope.Facturacion = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('facturacion', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };

    $scope.MiCuenta = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('miCuenta', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(response) {
                //OnError
                console.log(err);
            });
    };

});
