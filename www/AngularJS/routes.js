angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {
    //Manage logued in user
    var accessRestrictionHandler = function ($q, $rootScope, $state, clientDBO) {
        var deferred = $q.defer();

        // make sure user is logged in
        asyncCheckForLogin(function (status, result) {
            if (status) {
                // You may save target page URL in cookie for use after login successful later
                // To get the relative target URL, it is equal to ("#" + this.url).  
                //      The "this" here is the current scope for the parent state structure of the resolve call.
                $state.go('tabsController.reservaciones', {
                    idacta: result
                }, {
                    reload: true
                });

            } else // if logged in, continue to load the controllers.  Controllers should not start till resolve() is called.
                deferred.resolve();
        }.bind(this), $rootScope, clientDBO);

        return deferred.promise;
    };
    var asyncCheckForLogin = function (logged, rootScope, clientDBO) {
        clientDBO.get()
            .then(function successCallback(data) {
                if (data.length > 0) {
                    logged(true, data[0].idActa);
                } else {
                    logged(false, 0);
                }
            }, function errorCallback(err) {
                console.log(err);
                 logged(false, 0);
            });
    };

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginController',
        resolve: {
            loginRequired: accessRestrictionHandler
        }
    })

    .state('tabsController.reservaciones', {
        url: '/reservation/:idacta',
        cache: false,
        views: {
            'tab1': {
                templateUrl: 'templates/reservaciones.html',
                controller: 'reservationController'
            }
        },
        resolve: {
            // A string value resolves to a service
            reservationRepository: 'reservationRepository',
            // A function value resolves to the return
            listPendientes: function (reservationRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return reservationRepository.getPendientes(idacta);
            },
            listActuales: function (reservationRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return reservationRepository.getActuales(idacta);
            }
        }

    })

    .state('tabsController.reservar', {
        url: '/reservar',
        cache: false,
        views: {
            'tab1': {
                templateUrl: 'templates/reservar.html',
                controller: 'reservationNewController'
            }
        }
    })

    .state('tabsController.reservacionesAccion', {
        url: '/reservationaction',
        cache: false,
        views: {
            'tab1': {
                templateUrl: 'templates/reservacionesAccion.html',
                controller: 'reservationActionController'
            }
        },
        params: {
            reservationObj: null,
            estado: null
        }
    })

    .state('tabsController.buzon', {
        url: '/buzon/:idacta',
        cache: false,
        views: {
            'tab6': {
                templateUrl: 'templates/buzon.html',
                controller: 'mailController'
            }
        },
        resolve: {

            // A string value resolves to a service
            mailRepository: 'mailRepository',
            // A function value resolves to the return
            listMail: function (mailRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return mailRepository.getBuzon(idacta);
            }
        }
    })

    .state('tabsController.buzonDetalle', {
        url: '/maildetalle',
        cache: false,
        views: {
            'tab6': {
                templateUrl: 'templates/buzonDetalle.html',
                controller: 'mailDetailController'
            }
        },
        params: {
            mailObj: null
        }
    })

    .state('tabsController.correspondencia', {
        url: '/messaging/:idacta',
        cache: false,
        views: {
            'tab2': {
                templateUrl: 'templates/correspondencia.html',
                controller: 'messagingController'
            }
        },
        resolve: {
            // A string value resolves to a service
            messagingRepository: 'messagingRepository',
            // A function value resolves to the return
            listCorrespondencia: function (messagingRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return messagingRepository.getAlmacen(idacta);
            }
        }
    })

    .state('tabsController.correspondenciaDetalle', {
        url: '/messagingdetail',
        cache: false,
        views: {
            'tab2': {
                templateUrl: 'templates/correspondenciaDetalle.html',
                controller: 'messagingDetailController'
            }
        },
        params: {
            paqueteObj: null
        }
    })

    .state('tabsController.envios', {
        url: '/shipment/:idacta',
        cache: false,
        views: {
            'tab3': {
                templateUrl: 'templates/envios.html',
                controller: 'shipmentController'
            }
        },
        resolve: {
            // A string value resolves to a service
            shipmentRepository: 'shipmentRepository',
            // A function value resolves to the return
            listEnvios: function (shipmentRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return shipmentRepository.getEnvios(idacta);
            }
        }
    })

    .state('tabsController.enviosDetalle', {
        url: '/shipmentdetail',
        cache: false,
        views: {
            'tab3': {
                templateUrl: 'templates/enviosDetalle.html',
                controller: 'shipmentDetailController'
            }
        },
        params: {
            envioObj: null
        }
    })

    .state('consultas', {
        url: '/consultas/:idacta',
        templateUrl: 'templates/consultas.html',
        controller: 'historyController',
        cache: false,
        resolve: {
            // A string value resolves to a service
            reservationRepository: 'reservationRepository',
            messagingRepository: 'messagingRepository',
            shipmentRepository: 'shipmentRepository',
            // A function value resolves to the return
            listReservacion: function (reservationRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return reservationRepository.getPasadas(idacta);
            },
            listCorrespondencia: function (messagingRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return messagingRepository.getHistorico(idacta);
            },
            listEnvio: function (shipmentRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return shipmentRepository.getHistorico(idacta);
            }
        }
    })

    .state('reservacionesHistorico', {
        url: '/reservationhistory',
        templateUrl: 'templates/reservacionesHistorico.html',
        controller: 'reservationHistoryController',
        cache: false,
        params: {
            reservationObj: null
        }
    })

    .state('correspondenciaHistorico', {
        url: '/messaginghistory',
        templateUrl: 'templates/correspondenciaHistorico.html',
        controller: 'messagingHistoryController',
        cache: false,
        params: {
            paqueteObj: null
        }
    })

    .state('envioHistorico', {
        url: '/shipmenthistory',
        templateUrl: 'templates/enviosHistorico.html',
        controller: 'shipmentHistoryController',
        cache: false,
        params: {
            envioObj: null
        }
    })

    .state('facturacion', {
        url: '/facturacion/:idacta',
        templateUrl: 'templates/facturacion.html',
        controller: 'billingController',
        cache: false,
        resolve: {
            // A string value resolves to a service
            billingRepository: 'billingRepository',

            // A function value resolves to the return
            listFacturas: function (billingRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return billingRepository.getFacturas(idacta);
            },
            billing: function (billingRepository, $stateParams) {
                var idacta = $stateParams.idacta;
                return billingRepository.getBalance(idacta);
            }
        }
    })

    .state('miCuenta', {
        url: '/micuenta/:idacta',
        templateUrl: 'templates/miCuenta.html',
        controller: 'clientController'
    })

    .state('contacto', {
        url: '/contact',
        templateUrl: 'templates/contacto.html',
        controller: 'clientController'
    })

    .state('searchaddress', {
        url: '/searchaddress',
        templateUrl: 'templates/map.html',
        controller: 'mapController',
        cache: false,
        params: {
            messagingObj: null
        }
    })

    .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract: true
    })

    $urlRouterProvider.otherwise('/login')

});
