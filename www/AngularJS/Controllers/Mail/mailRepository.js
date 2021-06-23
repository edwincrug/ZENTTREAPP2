appServices.factory('mailRepository', function($http, configurationFactory) {

    var mailRepositoryURL = configurationFactory.globalAPI + 'mail/';

    return {

        getBuzon: function(idacta) {
            return $http({
                url: mailRepositoryURL + 'obtenerbuzon/',
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
        markRead: function(idcorreo) {
            return $http({
                url: mailRepositoryURL + 'updateleido/',
                method: "PUT",
                params: {
                    idcorreo: idcorreo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
