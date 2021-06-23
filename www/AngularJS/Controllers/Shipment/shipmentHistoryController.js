appControllers.controller('shipmentHistoryController', function ($scope, $rootScope, $state, $stateParams, alertFactory, sessionFactory, clientDBO) {

    $scope.model = this;

    $scope.model.envio = $stateParams.envioObj;

});
