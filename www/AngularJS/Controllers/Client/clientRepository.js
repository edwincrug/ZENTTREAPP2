appServices.factory('clientRepository', function ($http, configurationFactory) {

    var loginRepositoryGlobal = configurationFactory.globalAPI + 'client/';
    return {

        obtenerDatos: function (cliente, acta) {
            var loginURL = loginRepositoryGlobal + 'obtenerdatos/';
            return $http({
                url: loginURL,
                method: "GET",
                params: {
                    cliente: cliente,
                    acta: acta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        enviarMail: function (mail) {
            var loginURL = loginRepositoryGlobal + 'mailcontacto/';
            return $http({
                url: loginURL,
                method: "POST",
                data: mail,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});
