  appControllers.controller('mapController', function($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaGeolocation, $ionicSideMenuDelegate, $ionicModal, alertFactory, sessionFactory, clientDBO, shipmentRepository, messagingRepository) {

    // $state.reload();
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.model = this;
    //Alerta de dirección
    $scope.settingsAlert = alertFactory.alert(1);
    //Direccion original
    $scope.original = true;
    $scope.tipo = 1;
    $scope.entrega = false;

    /////////////////////////////////////////////////
    // Configuro el mapa
    $scope.mapOptions = {
        zoom: 18,
        draggable: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Settings Calendar
    $scope.settingsFecha = {
        display: 'center',
        controls: ['calendar'], // Show only the calendar
        multiSelect: false // Enable multi-selection
    };
    ////////////////////////////////////////////////
    // Inicializo el traductor de direcciones
    $scope.geocoder = new google.maps.Geocoder();

    // Dibujo el mapa
    $scope.DrawMap = function() {
        $scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapOptions);
    };


    //Localizar ubicación actual
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    // Obtiene la ubicación actual
    $scope.GetCurrentLocation = function() {
        //Verifico si viene de correspondencia
        if ($stateParams.messagingObj) {
            $scope.model.material = $stateParams.messagingObj.material;
            $scope.model.messagingObj = $stateParams.messagingObj;
        }

        $scope.entrega = false;

        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

            /////////////////////////////////////////////////
            //Obtengo la posición actual
            $scope.position = position;
            $scope.latLng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
            $scope.mapOptions.center = $scope.latLng;
            $scope.DrawMap();
            $scope.SetAddress();

        }, function(error) {
            $scope.model.alertTitle = 'error';
            $scope.model.alertText = 'no se puede obtener la ubicación, verifique la señal GPS';
            $scope.alertAddress.show();
            console.log("Could not get location");
            console.log(error);
            $scope.latLng = new google.maps.LatLng(19.4321142, -99.1331019);
            $scope.mapOptions.center = $scope.latLng;
            $scope.DrawMap();
            $scope.SetAddress();
        });

    };

    $scope.GetCurrentLocation();

    // Establece una nueva dirección
    $scope.SetAddress = function() {

        $scope.mapOptions.center = $scope.latLng;
        $scope.map.setCenter($scope.latLng);
        ////////////////////////////////////////////////
        //Limpio marcador
        if ($scope.marker)
            $scope.marker.setMap(null);
        // Asigno marcador
        $scope.marker = new google.maps.Marker({
            position: $scope.latLng,
            label: 'D',
            title: "destino",
            draggable: true
        });

        //Asigno el marcador al mapa
        $scope.marker.setMap($scope.map);

        $scope.AddDragListener();

        $scope.geocoder.geocode({
            latLng: $scope.latLng
        }, function(responses) {
            if (responses && responses.length > 0) {
                $scope.model.currentAddress = responses[0].formatted_address;
                //                if ($scope.original)
                //                    $scope.alertAddress.show();
                //Aplicamos el cambio
                $scope.$apply()

            } else {
                $scope.model.alertTitle = 'error';
                $scope.model.alertText = 'no se puede determinar la dirección exacta de este punto en el mapa';
                $scope.alertAddress.show();
                console.log('Cannot determine address at this location.');
            }
        });
    };

    // comment
    $scope.AddDragListener = function() {
        if (!$scope.marker.dragend) {
            ////////////////////////////////////////////////
            // Configuro la funcionalidad si se mueve el marcador
            google.maps.event.addListener($scope.marker, 'dragend', function(event) {
                var lat = this.getPosition().lat();
                var long = this.getPosition().lng();
                $scope.latLng = new google.maps.LatLng(lat, long);
                $scope.original = false;
                $scope.SetAddress();
            });
        }
    };


    $scope.GeocodeAddress = function() {
        //$scope.model.currentAddress = document.getElementById('address').value;
        $scope.entrega = false;

        $scope.geocoder.geocode({
            'address': $scope.model.currentAddress
        }, function(results, status) {
            ////////////////////////////////////////////////
            //Limpio marcador
            if ($scope.marker)
                $scope.marker.setMap(null);

            if (status === google.maps.GeocoderStatus.OK) {
                //Muestro los resultados
                if (results.length == 1) {
                    $scope.latLng = results[0].geometry.location;
                    $scope.SetAddress();
                    $scope.AddDragListener();
                } else {
                    $scope.model.resultados = results;
                    $scope.modal.show();
                }

            } else {
                $scope.model.alertTitle = 'error';
                $scope.model.alertText = 'no se puede determinar la ubicación con el texto proporcionado, intente ser más específico';
                $scope.alertAddress.show();
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    // Establece el marcador de acuerdo a la selección
    $scope.SetResult = function(res) {
        $scope.latLng = res.geometry.location;
        $scope.SetAddress();
        $scope.AddDragListener();
        $scope.modal.hide();
    };


    //Limpiar búsqueda
    $scope.ClearSearch = function() {
        $scope.model.currentAddress = '';
        $scope.entrega = false;
    };

    // establecer el tipo de envío
    $scope.SetTipo = function(tip) {
        $scope.tipo = tip;
    };

    // Establece la hora de inicio en función de la selección del combo
    $scope.SetHoraInicio = function(val) {
        $scope.entrega = false;
        var parts = val.split(':');
        $scope.desde = new Date($scope.model.fecha).setHours(parts[0], parts[1]);
        $scope.desde = new Date($scope.desde);
    };

    // Establece la hora de inicio en función de la selección del combo
    $scope.SetFechaInicio = function() {
        $scope.entrega = false;
    };

    // Establece la distancia entre los dos puntos
    $scope.SetDistance = function() {
        if ($scope.model.currentAddress != '') {
            //Bounds
            var bounds = new google.maps.LatLngBounds();
            //Deshabilito el dragable para el marcador origen
            $scope.marker.draggable = false;
            bounds.extend($scope.marker.position);
            //Se dibuja el marcador inicial
            ////////////////////////////////////////////////
            $scope.homeLatLng = new google.maps.LatLng(19.3795372, -99.1653251);
            //Limpio marcador
            if ($scope.homeMarker)
                $scope.homeMarker.setMap(null);
            // Asigno marcador
            $scope.homeMarker = new google.maps.Marker({
                position: $scope.homeLatLng,
                label: 'O',
                title: "origen",
                draggable: false
            });

            //Asigno el marcador al mapa
            $scope.homeMarker.setMap($scope.map);
            bounds.extend($scope.homeMarker.position);

            var service = new google.maps.DistanceMatrixService;
            service.getDistanceMatrix({
                origins: [$scope.homeLatLng],
                destinations: [$scope.latLng],
                travelMode: google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(), // for the time N milliseconds from now.
                    trafficModel: "pessimistic"
                },
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: true,
                avoidTolls: true
            }, function(response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    $scope.model.alertTitle = 'error';
                    $scope.model.alertText = 'no se puede determinar la ruta';
                    $scope.alertAddress.show();
                    console.log(status);
                } else {
                    var origins = response.originAddresses;
                    var destinations = response.destinationAddresses;

                    for (var i = 0; i < origins.length; i++) {
                        var results = response.rows[i].elements;
                        for (var j = 0; j < results.length; j++) {
                            var element = results[j];
                            $scope.model.distance = element.distance.text;
                            $scope.model.duration = element.duration.text;
                            var from = origins[i];
                            var to = destinations[j];

                            $scope.entrega = true;
                            //Aplicamos el cambio
                            $scope.$apply()

                        }
                    }

                    //now fit the map to the newly inclusive bounds
                    $scope.map.fitBounds(bounds);
                }
            });
        } else {
            $scope.model.alertTitle = 'advertencia';
            $scope.model.alertText = 'establezca una dirección destino';
            $scope.alertAddress.show();
        }
    };

    // Procesa el envío pendiente
    $scope.ProcesarEnvio = function() {
        if ($scope.model.destinatario != null && $scope.model.material != null && $scope.model.currentAddress != '') {
            clientDBO.get()
                .then(function successCallback(data) {
                    //OnSuccess
                    var destinatario = $scope.model.destinatario;
                    var condiciones = 'registrado desde la APP';
                    var lugar = $scope.model.currentAddress;
                    var material = $scope.model.material;

                    var objectEnvio = {
                        idacta: data[0].idActa,
                        desde: null,
                        hasta: null,
                        destinatario: destinatario,
                        material: material,
                        condiciones: condiciones,
                        lugar: lugar,
                        tipo: $scope.tipo
                    };
                    $ionicLoading.show({
                        template: 'solicitando mensajería...'
                    });

                    if ($stateParams.messagingObj) {

                        messagingRepository.postConvierteEnvio($stateParams.messagingObj.idCorrespondencia)
                            .then(function successCallback(response) {
                                shipmentRepository.addEnvio(objectEnvio)
                                    .then(function successCallback(response) {
                                        //OnSuccess
                                        $ionicLoading.hide();
                                        $state.go('tabsController.envios', {
                                            idacta: data[0].idActa
                                        }, {
                                            reload: true
                                        });
                                    }, function errorCallback(err) {
                                        //OnError
                                        console.log(err);
                                    });

                            }, function errorCallback(err) {
                                //OnError
                                console.log(err);
                            });
                    } else {
                        shipmentRepository.addEnvio(objectEnvio)
                            .then(function successCallback(response) {
                                //OnSuccess
                                $ionicLoading.hide();
                                $state.go('tabsController.envios', {
                                    idacta: data[0].idActa
                                }, {
                                    reload: true
                                });
                            }, function errorCallback(err) {
                                //OnError
                                console.log(err);
                            });
                    }
                }, function errorCallback(response) {
                    //OnError
                    console.log(err);
                });
        } else {
            $scope.model.alertTitle = 'advertencia';
            $scope.model.alertText = 'complete todos los campos antes de procesar el envío';
            $scope.alertAddress.show();
        }

    };

    // Cancela el envío
    $scope.Cancelar = function() {
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

    ///////////////////////////////////////////////////////////////////////////////////
    // Modal

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

});
