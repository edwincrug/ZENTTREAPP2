appControllers.controller('contactController', function ($scope, $rootScope, contactRepository, localStorageService, notificationFactory, sessionFactory) {

    //Función de inicio
    $scope.init = function () {
 $rootScope.state = 'Contactos';
        // Asigno el cliente al SCOPE
        $scope.cliente = sessionFactory.cliente;
        // Obtiene el contenido del almacen
        $scope.ReloadAll();
    };
    
    $scope.ReloadAll = function() {
       $scope.myPromise = contactRepository.getContactos(sessionFactory.cliente.idActa)
         .then(function successCallback(response) {
                //OnSuccess
                $scope.contactos = response.data;
            }, function errorCallback(response) {
                //OnError
                notificationFactory.error('Error al obtener los contactos.');
            });
    };

});
