appServices.factory('reservationRepository', function ($http, configurationFactory) {
  var reservationNewRepositoryGlobal = configurationFactory.globalAPI + 'reservation/'
  var consumeRepositoryGlobal = configurationFactory.globalAPI + 'consume/'

  return {
    getPendientes: function (idacta) {
      return $http({
        url: reservationNewRepositoryGlobal + 'obtenerpendientes/',
        method: 'GET',
        params: {
          idacta: idacta
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getPasadas: function (idacta) {
      return $http({
        url: reservationNewRepositoryGlobal + 'obtenerpasados/',
        method: 'GET',
        params: {
          idacta: idacta
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getActuales: function (idacta) {
      return $http({
        url: reservationNewRepositoryGlobal + 'obteneractuales/',
        method: 'GET',
        params: {
          idacta: idacta
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getOcupacion: function () {
      return $http({
        url: reservationNewRepositoryGlobal + 'obtenerocupacion/',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getOverlap: function (parameters) {
      return $http({
        url: reservationNewRepositoryGlobal + 'obteneroverlap/',
        method: 'GET',
        params: parameters,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getConsumos: function (idreservacion) {
      return $http({
        url: consumeRepositoryGlobal + 'consumosreservacion/',
        method: 'GET',
        params: {
          idreservacion: idreservacion
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getSaldoSalas: function (idacta, idreservacion) {
      return $http({
        url: reservationNewRepositoryGlobal + 'obtenersaldo/',
        method: 'GET',
        params: {
          idacta: idacta,
          idreservacion: idreservacion
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    save: function (event) {
      return $http({
        url: reservationNewRepositoryGlobal + 'agregar/',
        method: 'POST',
        data: event,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    update: function (event) {
      return $http({
        url: reservationNewRepositoryGlobal + 'actualizar/',
        method: 'PUT',
        data: event,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    deleteCancelar: function (idreservacion) {
      return $http({
        url: reservationNewRepositoryGlobal + 'cancelarreservacion/',
        method: 'DELETE',
        data: {
          idreservacion: idreservacion
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    deleteConsumo: function (idreservacionconsumo) {
      return $http({
        url: reservationNewRepositoryGlobal + 'eliminarconsumo/',
        method: 'DELETE',
        data: {
          idreservacionconsumo: idreservacionconsumo
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
})
