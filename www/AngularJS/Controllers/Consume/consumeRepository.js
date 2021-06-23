appServices.factory('consumeRepository', function ($http, configurationFactory) {

    var consumeNewRepositoryGlobal = configurationFactory.globalAPI + 'consume/';

    return {

        addConsumos: function (idreservacion, consumos) {
            return $http({
                url: consumeNewRepositoryGlobal + 'agregarconsumos/',
                method: "POST",
                data: {
                    idreservacion: idreservacion,
                    productos: consumos
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
