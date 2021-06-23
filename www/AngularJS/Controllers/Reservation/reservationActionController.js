appControllers.controller('reservationActionController', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicLoading', '$cordovaCalendar', '$ionicPopup', 'reservationRepository', 'sessionFactory', 'alertFactory', 'clientDBO', 'consumeRepository', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaCalendar, $ionicPopup, reservationRepository, sessionFactory, alertFactory, clientDBO, consumeRepository) {
  $scope.model = this

  // Gestión de consumos
  $scope.listConsumos = []
  $scope.model.coffeeCant = '12'
  $scope.model.coffeeGalletas = 'true'
  $scope.model.americanoCant = '1'
  $scope.model.capuchinoCant = '1'
  $scope.model.nespressoCant = '1'
  $scope.model.teCant = '1'
  $scope.model.aguaCant = '1'
  $scope.model.cocaCant = '1'

  $scope.model.reservation = $stateParams.reservationObj
  $scope.model.estado = $stateParams.estado

  // Ajusta Fechas
  $scope.AjustaFechaMas = function (dat) {
    var fecha = new Date(dat)
    return new Date(fecha.valueOf() + fecha.getTimezoneOffset() * 60000)
  }

  $scope.ValidaEstado = function () {
    if ($scope.model.reservation == null) {
      $state.go('login')
    } else {
      // Ajuste de fechas de inicio
      $scope.model.reservation.desdeCompleta = $scope.AjustaFechaMas($scope.model.reservation.desdeCompleta)
      $scope.model.inicio = $scope.model.reservation.desdeCompleta
      $scope.model.reservation.hastaCompleta = $scope.AjustaFechaMas($scope.model.reservation.hastaCompleta)
      $scope.model.fin = $scope.model.reservation.hastaCompleta
      // Obtengo los consumos
      reservationRepository.getConsumos($scope.model.reservation.idReservacion)
        .then(function successCallback (response) {
          $scope.listConsumosIncluidos = response.data
          $scope.SetSubTotal()
        }, function errorCallback (err) {
          // OnError
          alertFactory.message('error', 'no se pudieron obtener los consumos.')
          $ionicLoading.hide()
        })
    }

    // Valida Estado Consumos
    if ($scope.model.reservation.desdeCompleta.getDay() == 0) {
      $scope.model.noConsumo = true
      alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el día.')
    } else if ($scope.model.reservation.desdeCompleta.getDay() == 6) {
      if ($scope.model.reservation.desdeCompleta.getHours() >= 14 || $scope.model.reservation.desdeCompleta.getHours() < 9) {
        $scope.model.noConsumo = true
        alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
      } else {
        $scope.model.noConsumo = false
      }
    } else {
      if ($scope.model.reservation.desdeCompleta.getHours() >= 19 || $scope.model.reservation.desdeCompleta.getHours() < 9) {
        $scope.model.noConsumo = true
        alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
      } else {
        $scope.model.noConsumo = false
      }
    }
  }

  $scope.ValidaEstado()

  // Configuración SLIDER
  $scope.settingsSlider = {
    theme: 'ios',
    tooltip: true
  }

  // Calcula el subtotal
  $scope.SetSubTotal = function () {
    // Se calcula la diferencia en horas
    var dif = $scope.model.fin - $scope.model.inicio
    var horas = dif / (1000 * 60 * 60)

    $scope.subtotalSala = (horas * $scope.model.reservation.precio)
    $scope.subtotalConsumos = 0
    angular.forEach($scope.listConsumosIncluidos, function (value, key) {
      $scope.subtotalConsumos += (value.cantidad * value.precio)
    })
    angular.forEach($scope.listConsumos, function (value, key) {
      $scope.subtotalConsumos += (value.cantidad * value.precio)
    })
    $scope.subTotal = $scope.subtotalSala + $scope.subtotalConsumos
    $scope.iva = $scope.subTotal * 0.16
    $scope.total = $scope.subTotal * 1.16
  }

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000))
    return this
  }

  // Gestión de adelanto
  $scope.adelantovalue = 0
  $scope.model.adelanto = 0
  // Range
  $scope.dragAdelanto = function (value) {
    $scope.model.adelanto = value * 0.5
    $scope.model.inicio = new Date($scope.model.reservation.desdeCompleta).addHours(($scope.model.adelanto) * -1)
    $scope.SetSubTotal()
  }

  // Gestión de adelanto
  $scope.extensionvalue = 0
  $scope.model.extension = 0
  // Range

  $scope.dragExtension = function (value) {
    $scope.model.extension = value * 0.5
    $scope.model.fin = new Date($scope.model.reservation.hastaCompleta).addHours(($scope.model.extension))
    $scope.SetSubTotal()
  }

  $scope.ExtenderReservacion = function () {
    $ionicLoading.show({
      template: 'verificando disponibilidad...'
    })
    var desdeUTC = new Date($scope.model.inicio.valueOf() - $scope.model.inicio.getTimezoneOffset() * 60000)
    var hastaUTC = new Date($scope.model.fin.valueOf() - $scope.model.fin.getTimezoneOffset() * 60000)

    var params = {
      idsala: $scope.model.reservation.idSala,
      idsucursal: $scope.model.reservation.idSucursal,
      desde: desdeUTC,
      hasta: hastaUTC,
      idreservacion: $scope.model.reservation.idReservacion
    }
    reservationRepository.getOverlap(params)
      .then(function successCallback (response) {
        // OnSuccess
        $ionicLoading.hide()

        if (response.data[0].result == 0) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'horario disponible',
            template: '¿desea procesar la reservación?'
          })

          confirmPopup.then(function (res) {
            if (res) {
              $scope.model.reservation.desde = desdeUTC
              $scope.model.reservation.hasta = hastaUTC
              $scope.model.reservation.sucursal = $scope.model.reservation.idSucursal
              $scope.model.reservation.sala = $scope.model.reservation.idSala
              $ionicLoading.show({
                template: 'actualizando reservación...'
              })

              reservationRepository.update($scope.model.reservation)
                .then(function successCallback (response) {
                  // OnSuccess
                  $ionicLoading.hide()
                  if ($scope.listConsumos.length > 0) {
                    $ionicLoading.show({
                      template: 'agregando consumos...'
                    })

                    consumeRepository.addConsumos(response.data[0].result, JSON.stringify($scope.listConsumos))
                      .then(function successCallback (response) {
                        // OnSuccess
                        $ionicLoading.hide()
                        $ionicLoading.show({
                          template: 'reservación actualizada, redireccionando...'
                        })
                        setTimeout(function () {
                          clientDBO.get()
                            .then(function successCallback (data) {
                              // OnSuccess
                              $ionicLoading.hide()
                              $state.go('tabsController.reservaciones', {
                                idacta: data[0].idActa
                              }, {
                                reload: true
                              })
                            }, function errorCallback (response) {
                              // OnError
                              alertFactory.message('Error', 'Error al obtener el cliente logueado.')
                              $state.go('login')
                            })
                        }, 1000)
                      }, function errorCallback (err) {
                        // OnError
                        $ionicLoading.hide()
                        $ionicLoading.show({
                          template: '¡reservación actualizada! no fue posible agregar los consumos, intente nuevamente.'
                        })
                        setTimeout(function () {
                          clientDBO.get()
                            .then(function successCallback (data) {
                              // OnSuccess
                              $ionicLoading.hide()
                              $state.go('tabsController.reservaciones', {
                                idacta: data[0].idActa
                              }, {
                                reload: true
                              })
                            }, function errorCallback (response) {
                              // OnError
                              alertFactory.message('Error', 'Error al obtener el cliente logueado.')
                              $state.go('login')
                            })
                        }, 1000)
                      })
                  } else {
                    $ionicLoading.show({
                      template: 'reservación actualizada, redireccionando...'
                    })
                    setTimeout(function () {
                      clientDBO.get()
                        .then(function successCallback (data) {
                          // OnSuccess
                          $ionicLoading.hide()
                          $state.go('tabsController.reservaciones', {
                            idacta: data[0].idActa
                          }, {
                            reload: true
                          })
                        }, function errorCallback (response) {
                          // OnError
                          alertFactory.message('Error', 'Error al obtener el cliente logueado.')
                          $state.go('login')
                        })
                    }, 1000)
                  }
                }, function errorCallback (err) {
                  // OnError
                  console.log(err)
                  $ionicLoading.hide()
                })
            } else {
              console.log('You are not sure')
            }
          })
        } else {
          alertFactory.message('no disponible', 'el horario elegido no está disponible.')
        }
      }, function errorCallback (response) {
        // OnError
        alertFactory.message('advertencia', 'el horario elegido no está disponible.')
        $ionicLoading.hide()
      })
  }

  // eliminar consumos
  $scope.EliminarConsumo = function (obj) {
    var ini = new Date($scope.model.reservation.desdeCompleta).getTime()
    var fin = new Date().getTime()
    var diff = ini - fin

    if ((diff / (1000 * 60 * 60)) > 12) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'advertencia',
        template: '¿desea eliminar el consumo? esta acción no se puede deshacer'
      })
      confirmPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({
            template: 'eliminando consumo...'
          })
          reservationRepository.deleteConsumo(obj.idReservacionConsumo)
            .then(function successCallback (response) {
              clientDBO.get()
                .then(function successCallback (data) {
                  // OnSuccess
                  $ionicLoading.hide()
                  $state.go('tabsController.reservaciones', {
                    idacta: data[0].idActa
                  }, {
                    reload: true
                  })
                }, function errorCallback (response) {
                  // OnError
                  alertFactory.message('Error', 'Error al obtener el cliente logueado.')
                  $state.go('login')
                })
            }, function errorCallback (err) {
              // OnError
              alertFactory.message('error', 'no se pudo cancelar la sala.')
              $ionicLoading.hide()
            })
        } else {
          console.log('You are not sure')
        }
      })
    } else {
      // OnError
      alertFactory.message('advertencia', 'los consumos se deben cancelar con 12 horas de anticipación.')
    }
  }

  // Cancela una reservación
  $scope.CancelarReservacion = function () {
    var ini = new Date($scope.model.reservation.desdeCompleta).getTime()
    var fin = new Date().getTime()
    var diff = ini - fin

    if ((diff / (1000 * 60 * 60)) > 12) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'advertencia',
        template: '¿desea cancelar la reservación? esta acción no se puede deshacer'
      })
      confirmPopup.then(function (res) {
        if (res) {
          $ionicLoading.show({
            template: 'cancelando reservación...'
          })
          reservationRepository.deleteCancelar($scope.model.reservation.idReservacion)
            .then(function successCallback (response) {
              clientDBO.get()
                .then(function successCallback (data) {
                  // OnSuccess
                  $cordovaCalendar.deleteEvent({
                    newTitle: null,
                    location: null,
                    notes: null,
                    startDate: $scope.model.reservation.desdeCompleta,
                    endDate: $scope.model.reservation.hastaCompleta
                  }).then(function (result) {
                    // success
                    console.log('evento eliminado')
                  }, function (err) {
                    // error
                     console.log('error al eliminar el evento')
                     console.log(err)
                  })
                  $ionicLoading.hide()
                  $state.go('tabsController.reservaciones', {
                    idacta: data[0].idActa
                  }, {
                    reload: true
                  })
                }, function errorCallback (response) {
                  // OnError
                  alertFactory.message('Error', 'Error al obtener el cliente logueado.')
                  $state.go('login')
                })
            }, function errorCallback (err) {
              // OnError
              alertFactory.message('error', 'no se pudo cancelar la sala.')
              $ionicLoading.hide()
            })
        } else {
          console.log('You are not sure')
        }
      })
    }else {
      // OnError
      alertFactory.message('advertencia', 'las reservaciones se deben cancelar con 12 horas de anticipación.')
    }
  }

  // //////////////////////////////////////////////////////////////////////////
  // Array de consumos
  // Establece el costo de cada consumo elegido
  $scope.SetConsumo = function () {
    var consumo = {}

    // Consumo de café
    $scope.DeleteValue('coffee')
    if ($scope.model.coffee) {
      if ($scope.model.coffeeGalletas == 'true') {
        if ($scope.model.coffeeCant > 0) {
          switch ($scope.model.coffeeCant) {
            case '1':
              consumo = _Consumos.myFind({
                clave: 'COBR01'
              })
              consumo.cantidad = 1
              break
            case '2':
              consumo = _Consumos.myFind({
                clave: 'COBR02'
              })
              consumo.cantidad = 1
              break
            case '6':
              consumo = _Consumos.myFind({
                clave: 'COBR97'
              })
              consumo.cantidad = 1
              break
            case '12':
              consumo = _Consumos.myFind({
                clave: 'COBR98'
              })
              consumo.cantidad = 1
              break
          }
          $scope.listConsumos.push(consumo)
        }
      } else {
        if ($scope.model.coffeeCant > 0) {
          switch ($scope.model.coffeeCant) {
            case '1':
              consumo = _Consumos.myFind({
                clave: 'COBR03'
              })
              consumo.cantidad = 1
              break
            case '2':
              consumo = _Consumos.myFind({
                clave: 'COBR04'
              })
              consumo.cantidad = 1
              break
            case '6':
              consumo = _Consumos.myFind({
                clave: 'COBR32'
              })
              consumo.cantidad = 1
              break
            case '12':
              consumo = _Consumos.myFind({
                clave: 'COBR92'
              })
              consumo.cantidad = 1
              break
          }
          $scope.listConsumos.push(consumo)
        }
      }
    }

    // Café americano
    $scope.DeleteValue('americano')
    if ($scope.model.americano) {
      if ($scope.model.americanoCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'CAFE33'
        })
        consumo.cantidad = $scope.model.americanoCant
        $scope.listConsumos.push(consumo)
      }
    }

    // Café Capuccino
    $scope.DeleteValue('capuchino')
    if ($scope.model.capuchino) {
      if ($scope.model.capuchinoCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'CLEX94'
        })
        consumo.cantidad = $scope.model.capuchinoCant
        $scope.listConsumos.push(consumo)
      }
    }
    // Nesspreso
    $scope.DeleteValue('nespresso')
    if ($scope.model.nespresso) {
      if ($scope.model.nespressoCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'CFENR110'
        })
        consumo.cantidad = $scope.model.nespressoCant
        $scope.listConsumos.push(consumo)
      }
    }

    // Te
    $scope.DeleteValue('te')
    if ($scope.model.te) {
      if ($scope.model.teCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'TEE120'
        })
        consumo.cantidad = $scope.model.teCant
        $scope.listConsumos.push(consumo)
      }
    }

    // Agua
    $scope.DeleteValue('agua')
    if ($scope.model.agua) {
      if ($scope.model.aguaCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'BOAG51'
        })
        consumo.cantidad = $scope.model.aguaCant
        $scope.listConsumos.push(consumo)
      }
    }

    // Coca
    $scope.DeleteValue('coca')
    if ($scope.model.coca) {
      if ($scope.model.cocaCant > 0) {
        consumo = _Consumos.myFind({
          clave: 'REFR97'
        })
        consumo.cantidad = $scope.model.cocaCant
        $scope.listConsumos.push(consumo)
      }
    }

    $scope.SetSubTotal()
  }

  // Elimina un consumo del array de consumos
  $scope.DeleteValue = function (tipo) {
    var index = -1
    angular.forEach($scope.listConsumos, function (value, key) {
      if (value.tipo == tipo)
        index = key
    })

    //        var found = $scope.listConsumos.filter(function (item) {
    //            return item.tipo == tipo
    //        })
    delete $scope.listConsumos[index]
  }

  // Prototype for FIND
  Array.prototype.myFind = function (obj) {
    return this.filter(function (item) {
      for (var prop in obj)
        if (!(prop in item) || obj[prop] !== item[prop])
          return false
      return true
    })[0]
  }
}])
