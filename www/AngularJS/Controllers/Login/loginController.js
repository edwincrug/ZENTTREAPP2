appControllers.controller('loginController', function ($scope, $rootScope, $ionicPopup, $ionicLoading, $cordovaInAppBrowser, $state, loginRepository, clientRepository, alertFactory, sessionDBO, clientDBO) {

    $scope.usuario = this;

    $scope.usuario.mail = '';
    $scope.usuario.clave = '';

    $scope.settingsAlert = alertFactory.alert(1);



    //Inicio Sesión
    $scope.Login = function () {

        //Inicio sesión
        $ionicLoading.show({
            template: 'iniciando sesión...'
        });
        loginRepository.iniciarSesion($scope.usuario.mail, $scope.usuario.clave)
            .then(
                function successCallback(response) {
                    $ionicLoading.hide();
                    if (response.data[0].token != 'notfound') {
                        //Insertar la sesión
                        sessionDBO.add(response.data[0])
                            .then(function successCallback(data) {
                                //Obtengo los datos del usuario logueado
                                $ionicLoading.show({
                                    template: 'obteniendo datos de usuario.'
                                });
                                clientRepository.obtenerDatos(response.data[0].cliente, 0)
                                    .then(
                                        function successCallback(responseUsuario) {
                                            $ionicLoading.hide();
                                            //Guardo la selección
                                            //sessionFactory.multiple = response.data[0].clase;
                                            //Guardo los datos del usuario logueado
                                            clientDBO.add(responseUsuario.data[0])
                                                .then(function successCallback(data) {
                                                    $state.go('tabsController.reservaciones', {
                                                        idacta: responseUsuario.data[0].idActa
                                                    }, {
                                                        reload: true
                                                    });
                                                }, function errorCallback(err) {
                                                    //OnError
                                                    console.log(err);
                                                });

                                        },
                                        function errorCallback(err) {
                                            $ionicLoading.hide();
                                            console.log(err);
                                        }
                                    );
                            }, function errorCallback(err) {
                                //OnError
                                console.log(err);
                            });

                    } else {
                        $scope.alertAccess.show();
                        //alertFactory.message('advertencia', 'usuario y/o password incorrecto');
                    }
                },
                function errorCallback(err) {
                    $ionicLoading.hide();
                    console.log(err);
                }
            );
    };

});
