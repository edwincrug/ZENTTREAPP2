appControllers.controller('mailController', ['$scope', '$rootScope', '$state', '$filter', 'listMail', 'mailRepository', 'alertFactory', 'clientDBO', function($scope, $rootScope, $state, $filter, listMail, mailRepository, alertFactory, clientDBO) {

    $scope.model = this;
    //  $rootScope.model = this;

    $scope.model.mails = listMail.data;
    $rootScope.model.badgeMail = $filter('filter')($scope.model.mails, { unread: 1 }).length;

    //Agrego un watch para gestionar los cambios de estado
    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.listMail', function(listMail) {
        if (listMail != null) {
            $scope.model.mails = listMail.data;
            $rootScope.model.badgeMail = $filter('filter')($scope.model.mails, { unread: 1 }).length;
        }
    });
    
    // Obtengo la lista de correos
    $scope.doRefresh = function() {
        clientDBO.get()
            .then(function successCallback(data) {
                //OnSuccess
                mailRepository.getBuzon(data[0].idActa)
                    .then(function successCallback(response) {
                        //OnSuccess
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.model.mails = response.data;
                        $rootScope.model.badgeMail = $filter('filter')($scope.model.mails, { unread: 1 }).length;

                    }, function errorCallback(err) {
                        //OnError
                        $scope.$broadcast('scroll.refreshComplete');
                        alertFactory.message('Error', 'Error al obtener la información del buzón.');
                        console.log(err);
                    });
            }, function errorCallback(err) {
                //OnError
                $scope.$broadcast('scroll.refreshComplete');
                console.log(err);
            });

    };

    $scope.VerDetalle = function(mail) {

        $state.go('tabsController.buzonDetalle', {
            mailObj: mail
        }, {
            reload: true
        });
    };


}]);
