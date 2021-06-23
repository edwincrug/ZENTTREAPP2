appServices.factory('messagingRepository', function($http, configurationFactory) {

    var messagingRepositoryGlobal = configurationFactory.globalAPI + 'messaging/';

    return {

        getAlmacen: function(idacta) {
            return $http({
                url: messagingRepositoryGlobal + 'obtenerpendientes/',
                method: "GET",
                params: {
                    idacta: idacta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getHistorico: function(idacta) {
            return $http({
                url: messagingRepositoryGlobal + 'obtenerpasados/',
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
        convertir: function(idcorrespondencia) {
            return $http({
                url: messagingRepositoryGlobal + 'convierteaenvio/',
                method: "POST",
                data: {
                    idcorrespondencia: idcorrespondencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        escanear: function(idcorrespondencia) {
            return $http({
                url: messagingRepositoryGlobal + 'agregaescaneo/',
                method: "POST",
                data: {
                    idcorrespondencia: idcorrespondencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postConvierteEnvio: function(idcorrespondencia) {
            return $http({
                url: messagingRepositoryGlobal + 'convierteaenvio/',
                method: "POST",
                data: {
                    idcorrespondencia: idcorrespondencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
