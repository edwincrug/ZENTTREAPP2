appControllers.controller('mailDetailController', ['$scope', '$rootScope', '$state', '$sce', '$stateParams', 'mailRepository', 'alertFactory', 'clientDBO', '$cordovaInAppBrowser', function($scope, $rootScope, $state, $sce, $stateParams, mailRepository, alertFactory, clientDBO, $cordovaInAppBrowser) {

    $scope.model = this;

    $scope.model.mail = $stateParams.mailObj;

    mailRepository.markRead($scope.model.mail.idCorreo)
        .then(function successCallback(data) {
            //OnSuccess
            console.log('success');
        }, function errorCallback(err) {
            //OnError
            console.log(err);
        });

    if ($scope.model.mail == null) {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                $state.go('tabsController.buzon', {
                    idacta: data[0].idActa
                }, {
                    reload: true
                });
            }, function errorCallback(err) {
                //OnError
                console.log(err);
            });
    } else {
        $scope.model.mailDetail = $sce.trustAsHtml($scope.model.mail.cuerpo);
    }


    $scope.AbrirAdjunto = function(adj){
         var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'yes'
        };

        $cordovaInAppBrowser.open('https://docs.google.com/viewer?url=' + adj, '_blank', options)
            .then(function(event) {
                // success
                console.log(fac.ruta);
            })
            .catch(function(error) {
                // error
                alertFactory.error(error);
            });
    }



}]);
