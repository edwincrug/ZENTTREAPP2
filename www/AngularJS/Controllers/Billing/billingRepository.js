appServices.factory('billingRepository', function ($http, configurationFactory) {

    var billingRepositoryURL = configurationFactory.globalAPI + 'billing/';

    return {

        getFacturas: function (idacta) {
            return $http({
                url: billingRepositoryURL + 'obtenerfacturas/',
                method: "GET",
                params: {
                    idacta: idacta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPagos: function (idacta) {
            return $http({
                url: billingRepositoryURL + 'obtenerpagos/',
                method: "GET",
                params: {
                    idacta: idacta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getBalance: function (idacta) {
            var loginURL = configurationFactory.globalAPI + 'dashboard/' + 'obtenerbalance/';
            return $http({
                url: loginURL,
                method: "GET",
                params: {
                    idacta: idacta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
