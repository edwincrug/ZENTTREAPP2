appControllers.controller('clientController', function ($scope, $rootScope, $state, $ionicLoading, clientRepository, alertFactory, clientDBO, sessionDBO) {

    $scope.model = this;
    // Carga cliente
    $scope.LoadClient = function () {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                if (data.length > 0) {
                    $scope.model.cliente = data[0];
                }
            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });
    };

    $scope.LoadClient();
    // Redirige hacia la pantalla de Inicio
    $scope.CerrarSesion = function () {
        sessionDBO.removeAll()
            .then(function successCallback(data) {
                //OnSuccess
                clientDBO.removeAll()
                    .then(function successCallback(data) {
                        //OnSuccess
                        $state.go('login');
                    }, function errorCallback(err) {
                        //OnError
                        console.log(err);
                    });
            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });
    };

    $scope.Contacto = function () {
        if (($scope.model.nombre != '' &&
                $scope.model.correo != '' &&
                $scope.model.telefono != '') && ($scope.model.nombre != null &&
                $scope.model.correo != null &&
                $scope.model.telefono != null)) {
            $ionicLoading.show({
                template: 'enviando solicitud...'
            });
            clientRepository.enviarMail({
                    nombre: $scope.model.nombre,
                    correo: $scope.model.correo,
                    telefono: $scope.model.telefono
                })
                .then(function successCallback(response) {
                    //OnSuccess
                    $ionicLoading.show({
                        template: 'nos pondremos en contacto con usted a la brevedad.'
                    });

                    $scope.model.nombre = '';
                    $scope.model.correo = '';
                    $scope.model.telefono = '';
                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 3000);

                }, function errorCallback(err) {
                    //OnError
                    console.log(err);
                });
        } else {
            $ionicLoading.show({
                template: 'introduzca sus datos.'
            });
            setTimeout(function () {
                $ionicLoading.hide();
            }, 3000);
        }
    }


});
