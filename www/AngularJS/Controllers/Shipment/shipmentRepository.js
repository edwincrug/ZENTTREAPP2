appServices.factory('shipmentRepository', function ($http, configurationFactory) {

    var shipmentRepositoryGlobal = configurationFactory.globalAPI + 'shipment/';

    return {

        getEnvios: function (idacta) {
            return $http({
                url: shipmentRepositoryGlobal + 'obtenerpendientes/',
                method: "GET",
                params: {
                    idacta: idacta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getHistorico: function (idacta) {
            return $http({
                url: shipmentRepositoryGlobal + 'obtenerpasados/',
                method: "GET",
                params: {
                    idacta: idacta,
                    dispositivo: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        addEnvio: function (objeto) {
            return $http({
                url: shipmentRepositoryGlobal + 'agregar/',
                method: "POST",
                data: objeto,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
