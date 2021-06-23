appControllers.controller('messagingDetailController', ['$scope', '$rootScope', '$state', '$stateParams', 'messagingRepository', 'alertFactory', 'clientDBO', '$ionicPopup', '$ionicLoading', function ($scope, $rootScope, $state, $stateParams, messagingRepository, alertFactory, clientDBO, $ionicPopup, $ionicLoading) {
  $scope.model = this

  $scope.model.paquete = $stateParams.paqueteObj

  // Alerta configuración
  $scope.settingsAlert = alertFactory.alert(1)

  // Convierte una correspondencia en envío
  $scope.OpenShipment = function () {
    $state.go('searchaddress', {
      messagingObj: $scope.model.paquete
    }, {
      reload: true
    })
  }

  // comment
  $scope.ScanMessaging = function () {
    var now = new Date()
    $scope.model.allowScan = false
    // Valido consumos en horario fuera de operación
    if (now.getDay() == 0) {
      alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el día.')
    } else if (now.getDay() == 6) {
      if (now.getHours() >= 14 || now.getHours() < 9) {
        alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
      } else {
        $scope.model.allowScan = true
      }
    } else {
      if (now.getHours() >= 19 || now.getHours() < 9) {
        alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
      } else {
        $scope.model.allowScan = true
      }
    }

    if ($scope.model.allowScan) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'confirme escaneo',
        template: '¿desea recibir la correspondencia escaneada en su correo electrónico por $ 8.00 p/hoja ?'
      })

      confirmPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({
            template: 'solicitando escaneo...'
          })

          messagingRepository.postConvierteEnvio($scope.model.paquete.idCorrespondencia)
            .then(function successCallback (response) {
              messagingRepository.escanear($scope.model.paquete.idCorrespondencia)
                .then(function successCallback (response) {
                  // OnSuccess
                  $ionicLoading.hide()
                  $ionicLoading.show({
                    template: 'en breve recibirá un correo electrónico con el documento adjunto'
                  })
                  setTimeout(function () {
                    clientDBO.get()
                      .then(function successCallback (data) {
                        // OnSuccess
                        $ionicLoading.hide()
                        $state.go('tabsController.correspondencia', {
                          idacta: data[0].idActa
                        }, {
                          reload: true
                        })
                      }, function errorCallback (response) {
                        // OnError
                        console.log(err)
                      })
                  }, 500)
                }, function errorCallback (err) {
                  // OnError
                  console.log(err)
                })
            }, function errorCallback (err) {
              // OnError
              console.log(err)
            })
        } else {
          console.log('You are not sure')
        }
      })
    }
  }
}])
