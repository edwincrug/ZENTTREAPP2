appControllers.controller('messagingHistoryController', function ($scope, $rootScope, $state, $stateParams, alertFactory, sessionFactory, clientDBO) {

    $scope.model = this;

    $scope.model.paquete = $stateParams.paqueteObj;

});
