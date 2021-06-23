appControllers.controller('billingController', ['$scope', '$rootScope', '$sce', '$cordovaFileOpener2', '$state', '$cordovaInAppBrowser', 'listFacturas', 'billing', 'alertFactory', 'clientDBO', function($scope, $rootScope, $sce, $cordovaFileOpener2, $state, $cordovaInAppBrowser, listFacturas, billing, alertFactory, clientDBO) {

    $scope.model = this;

    $scope.model.facturas = listFacturas.data;
    $scope.model.balance = billing.data[0];

    //Agrego un watch para gestionar los cambios de estado
    $scope.$state = $state;

    $scope.$watch('$state.$current.locals.globals.listFacturas', function(listFacturas) {
        if (listFacturas != null)
            $scope.model.facturas = listFacturas.data;
    });

    $scope.$watch('$state.$current.locals.globals.billing', function(billing) {
        if (billing != null)
            $scope.model.balance = billing.data[0];
    });

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    // Visualiza PDFs
    $scope.VerPDF = function(fac) {
        // $scope.model.currentPDF = 'http://docs.google.com/viewer?url=' + fac.ruta;
        var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'yes'
        };

        $cordovaInAppBrowser.open('https://docs.google.com/viewer?url=' + fac.ruta, '_blank', options)
            .then(function(event) {
                // success
                console.log(fac.ruta);
            })
            .catch(function(error) {
                // error
                alertFactory.error(error);
            });

    };


}]);
