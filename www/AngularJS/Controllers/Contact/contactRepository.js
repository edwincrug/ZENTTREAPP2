appServices.factory('contactRepository', function ($http, configurationFactory) {

    var contactRepositoryGlobal = configurationFactory.globalAPI + 'contact/';

    return {

        getContactos: function (idacta) {
            return $http({
                url: contactRepositoryGlobal + 'obtenerdatos/',
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
