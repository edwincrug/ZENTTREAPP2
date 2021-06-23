appControllers.controller('reservationNewController', ['$scope', '$rootScope', '$ionicLoading', '$ionicPopup', '$state', '$cordovaCalendar', 'reservationRepository', 'consumeRepository', 'alertFactory', 'clientDBO', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $state, $cordovaCalendar, reservationRepository, consumeRepository, alertFactory, clientDBO) {
  $scope.model = this
  // $scope.model.reservaciones = listOcupacion.data

  $scope.model.active = false
  $scope.model.consumos = false
  $scope.model.inicio = new Date()

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

  // Prototype for FIND
  Array.prototype.myFind = function (obj) {
    return this.filter(function (item) {
      for (var prop in obj)
        if (!(prop in item) || obj[prop] !== item[prop])
          return false
      return true
    })[0]
  }

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000))
    return this
  }

  $scope.hours = 0.5
  // $scope.model.duration = 0
  // Range
  $scope.drag = function (value) {
    // $scope.model.duration = value
    $scope.model.fin = new Date($scope.model.inicio).addHours(value)
    $scope.hours = value
    if ($scope.model.currentRoom != null) {
      $scope.SetSubTotal()
    }
  }

  // Calcula los totales
  $scope.SetSubTotal = function () {
    // Obtengo los datos del cliente
    clientDBO.get()
      .then(function successCallback (data) {
        $scope.cliente = data[0]
        reservationRepository.getSaldoSalas($scope.cliente.idActa)
          .then(function (response) {
            $scope.saldo = response.data[0].saldo
            $scope.subtotalDirecto = ($scope.hours * $scope.model.currentRoom.cost)
            // Calculo el descuento del saldo en salas
            $scope.subtotalSala = ((($scope.saldo - $scope.subtotalDirecto) > 0) ? 0 : ($scope.subtotalDirecto - $scope.saldo))
            // Calculo de consumos
            $scope.subtotalConsumos = 0
            angular.forEach($scope.listConsumos, function (value, key) {
              $scope.subtotalConsumos += (value.cantidad * value.precio)
            })
            $scope.subTotal = $scope.subtotalSala + $scope.subtotalConsumos
            $scope.iva = $scope.subTotal * 0.16
            $scope.total = $scope.subTotal * 1.16
          },
            function (err) {
              console.log(err)
            })
      }, function (err) {
        console.log(err)
      })
  }

  $scope.SetFecha = function () {
    $scope.SetHoraInicio($scope.selInicio)
  // body...
  }

  // Establece la hora de inicio en función de la selección del combo
  $scope.SetHoraInicio = function (val) {
    if ($scope.model.inicio != null) {
      var parts = val.split(':')
      // $scope.model.inicio = new Date().setHours(parts[0], parts[1])
      $scope.model.inicio = new Date(new Date($scope.model.inicio).setHours(parts[0], parts[1]))
      // $scope.model.duration = 0.5
      $scope.model.fin = new Date($scope.model.inicio).addHours($scope.hours)

      $scope.drag($scope.hours)

      // Valido consumos en horario fuera de operación
      if ($scope.model.inicio.getDay() == 0) {
        $scope.model.allowConsumos = false
        alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el día.')
        $scope.listConsumos = []
      } else if ($scope.model.inicio.getDay() == 6) {
        if ($scope.model.inicio.getHours() >= 14 || $scope.model.inicio.getHours() < 9) {
          $scope.model.allowConsumos = false
          alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
          $scope.listConsumos = []
        } else {
          $scope.model.allowConsumos = true
        }
      } else {
        if ($scope.model.inicio.getHours() >= 19 || $scope.model.inicio.getHours() < 9) {
          $scope.model.allowConsumos = false
          alertFactory.message('advertencia', 'no se pueden agregar consumos adicionales para el horario seleccionado.')
          $scope.listConsumos = []
        } else {
          $scope.model.allowConsumos = true
        }
      }
    }
  }

  // Se configura la hora de inicio
  // $scope.fecha = new Date()
  $scope.selInicio = '12:00'
  $scope.SetHoraInicio($scope.selInicio)

  // Settings Calendar
  $scope.settingsFecha = {
    display: 'center',
    controls: ['calendar'], // Show only the calendar
    multiSelect: false // Enable multi-selection
  }

  $scope.settingsSlider = {
    theme: 'ios',
    tooltip: true
  }

  $scope.settingsSwitch = {
    theme: 'ios',
    tooltip: true
  }

  // Monitorea el cambio de sucursal
  $scope.SetSucursal = function (sel) {
    if (sel == 'del valle 1') {
      $scope.model.rooms = _Salas.delValle1.sala
      $scope.model.sucursal = 1
      $scope.SetRoom(_Salas.delValle1.sala[0])
    }
    if (sel == 'del valle 2') {
      $scope.model.rooms = _Salas.delValle2.sala
      $scope.model.sucursal = 2
      $scope.SetRoom(_Salas.delValle2.sala[0])
    }
    $scope.model.active = true
    $scope.model.roomType = 1
  }

  $scope.SetType = function (opt) {
    $scope.model.roomType = opt
    if ($scope.model.roomType == 1) {
      if ($scope.model.sucursal == 1) {
        $scope.model.rooms = _Salas.delValle1.sala
        $scope.SetRoom(_Salas.delValle1.sala[0])
      }
      if ($scope.model.sucursal == 2) {
        $scope.model.rooms = _Salas.delValle2.sala
        $scope.SetRoom(_Salas.delValle2.sala[0])
      }
    }
    if ($scope.model.roomType == 2) {
      if ($scope.model.sucursal == 1) {
        $scope.model.rooms = _Salas.delValle1.oficina
        $scope.SetRoom(_Salas.delValle1.oficina[0])
      }
      if ($scope.model.sucursal == 2) {
        $scope.model.rooms = _Salas.delValle2.oficina
        $scope.SetRoom(_Salas.delValle2.oficina[0])
      }
    }
  }

  // Asigna la sala seleccionada actualmente
  $scope.SetRoom = function (room) {
    if ($scope.model.currentRoom)
      $scope.model.currentRoom.selected = false
    $scope.model.currentRoom = room
    $scope.model.currentRoom.selected = true
    $scope.drag($scope.hours)
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

  // comment
  $scope.VerifcarDisponibilidad = function () {
    $ionicLoading.show({
      template: 'verificando disponibilidad...'
    })
    var desdeUTC = new Date($scope.model.inicio.valueOf() - $scope.model.inicio.getTimezoneOffset() * 60000)
    var hastaUTC = new Date($scope.model.fin.valueOf() - $scope.model.fin.getTimezoneOffset() * 60000)
    var params = {
      idsala: $scope.model.currentRoom.id,
      idsucursal: $scope.model.sucursal,
      desde: desdeUTC,
      hasta: hastaUTC
    }
    if ($scope.model.currentRoom != null && $scope.model.fin != null) {
      // Obtengo los datos del cliente
      clientDBO.get()
        .then(function successCallback (data) {
          $scope.cliente = data[0]
          // OnSuccess
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
                    var event = {
                      idempleado: 1,
                      idcontrato: $scope.cliente.idContrato,
                      sala: $scope.model.currentRoom.id,
                      sucursal: $scope.model.sucursal,
                      desde: desdeUTC,
                      hasta: hastaUTC,
                      horas: 0,
                      total: 0,
                      comentarios: 'Reservada desde APP'
                    }
                    $ionicLoading.show({
                      template: 'reservando sala...'
                    })
                    reservationRepository.save(event)
                      .then(function successCallback (response) {
                        // OnSuccess
                        $ionicLoading.hide()
                        console.log('Creando evento')
                        var fechaReservacion = 'Reservado el ' + new Date().getFullYear().toString() + '/' + new Date().getMonth().toString() + '/' + new Date().getDay().toString()
                        var lugar = ($scope.model.sucursal == 1) ? 'Aniceto Ortega 817' : 'Luz Saviñon 305'
                        // Creo el evento en el calendario
                        $cordovaCalendar.createEvent({
                          title: 'reservación - zenttre',
                          location: lugar,
                          notes: fechaReservacion,
                          startDate: $scope.model.inicio,
                          endDate: $scope.model.fin
                        })
                        if ($scope.listConsumos.length > 0) {
                          $ionicLoading.show({
                            template: 'agregando consumos...'
                          })

                          consumeRepository.addConsumos(response.data[0].result, JSON.stringify($scope.listConsumos))
                            .then(function successCallback (response) {
                              // OnSuccess
                              $ionicLoading.hide()
                              $ionicLoading.show({
                                template: 'evento reservado correctamente, se ha agregado al calendario'
                              })

                              setTimeout(function () {
                                $ionicLoading.hide()
                                $state.go('tabsController.reservaciones', {
                                  idacta: $scope.cliente.idActa
                                }, {
                                  reload: true
                                })
                              }, 2000)
                            }, function errorCallback (err) {
                              // OnError
                              $ionicLoading.hide()
                              $ionicLoading.show({
                                template: 'evento reservado, no fue posible agregar los consumos, intente nuevamente.'
                              })
                              setTimeout(function () {
                                $ionicLoading.hide()
                                $state.go('tabsController.reservaciones', {
                                  idacta: $scope.cliente.idActa
                                }, {
                                  reload: true
                                })
                              }, 2000)
                            })
                        } else {
                          $ionicLoading.show({
                            template: 'evento reservado correctamente, se ha agregado al calendario'
                          })
                          setTimeout(function () {
                            $ionicLoading.hide()
                            $state.go('tabsController.reservaciones', {
                              idacta: $scope.cliente.idActa
                            }, {
                              reload: true
                            })
                          }, 2000)
                        }
                      }, function errorCallback (response) {
                        // OnError
                        $ionicLoading.hide()
                        alertFactory.message('Error', 'El al guardar la reservación, intente de nuevo. ' + response.data)
                      })
                  } else {
                    console.log('You are not sure')
                  }
                })
              } else {
                alertFactory.message('no disponible', 'el horario elegido no está disponible, pruebe cambiando de sala.')
              }
            }, function errorCallback (response) {
              // OnError
              alertFactory.message('advertencia', 'el horario elegido no está disponible, pruebe cambiando de sala.')
              $ionicLoading.hide()
            })
        }, function errorCallback (response) {
          // OnError
          alertFactory.message('Error', 'Error al obtener los datos del cliente logueado.')
        })
    } else {
      alertFactory.message('datos incompletos.', 'configure su reservación antes de continuar.')
    }
  }
}])
