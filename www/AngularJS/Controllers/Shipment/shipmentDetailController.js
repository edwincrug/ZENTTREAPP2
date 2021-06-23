appControllers.controller('shipmentDetailController', function ($scope, $rootScope, $state, $http, configurationFactory, $stateParams, messagingRepository, alertFactory, clientDBO) {

    $scope.model = this;
    $scope.model.envio = $stateParams.envioObj;

    $scope.mapOptions = {
        zoom: 18,
        draggable: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setInterval(function () {
        if ($scope.model.envio != null) {
            if ($scope.model.envio.etapa == 2) {
                $http({
                    url: configurationFactory.globalAPI + 'messenger/ubicacion',
                    method: "GET",
                    params: {
                        idmensajero: $scope.model.envio.idMensajero
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    //Se confirma el guardado
                    // Dibujo el mapa
                    $scope.latLng = new google.maps.LatLng(response.data[0].latitud, response.data[0].longitud);
                    $scope.mapOptions.center = $scope.latLng;
                     $scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapOptions);
                
                    ////////////////////////////////////////////////
                    //Limpio marcador
                    if ($scope.marker)
                        $scope.marker.setMap(null);
                    // Asigno marcador
                    $scope.marker = new google.maps.Marker({
                        position: $scope.latLng,
                        label: 'mensajero',
                        title: "destino",
                        draggable: true
                    });
                    //Asigno el marcador al mapa
                    $scope.marker.setMap($scope.map);

                }, function errorCallback(err) {
                    //OnError
                    console.log(err);
                });


            }
        }

    }, 5000);
});
