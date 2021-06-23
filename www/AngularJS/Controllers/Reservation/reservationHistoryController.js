appControllers.controller('reservationHistoryController', ['$scope', '$rootScope', '$state', '$stateParams', 'alertFactory', 'sessionFactory', 'clientDBO', function ($scope, $rootScope, $state, $stateParams, alertFactory, sessionFactory, clientDBO) {

    $scope.model = this;

    $scope.model.reservation = $stateParams.reservationObj;

}]);
