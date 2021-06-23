appServices.factory('loginRepository', function ($http, configurationFactory) {

    var loginRepositoryGlobal = configurationFactory.globalAPI + 'login/';

    return {

        iniciarSesion: function (user, password) {
            var loginURL = loginRepositoryGlobal + 'iniciarsesion/';
            return $http({
                url: loginURL,
                method: "GET",
                params: {
                    usuario: user,
                    password: password,
                    dispositivo: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validarSesion: function (token) {
            var loginURL = loginRepositoryGlobal + 'validarsesion/';
            return $http({
                url: loginURL,
                method: "GET",
                params: {
                    token: token,
                    dispositivo: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});
