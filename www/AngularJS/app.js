// Ionic Starter App

// Base de datos
var db = null
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var apps = angular.module('app', ['ionic', 'ionic.cloud', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngSanitize', 'mobiscroll-calendar', 'mobiscroll-select', 'mobiscroll-slider', 'mobiscroll-form', 'mobiscroll-widget'])

  .run(function ($ionicPlatform, $rootScope, $ionicLoading, $ionicPopup, $cordovaSQLite, $cordovaBadge, $ionicPush, $state, backgroundFactory, clientDBO) {
    window.onerror = function (errorMsg, url, lineNumber) {
      console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber)
    }

    // Push Notification
    $ionicPush.register().then(function (t) {
      return $ionicPush.saveToken(t)
    }).then(function (t) {
      console.log('Token saved:', t.token)
    })

    // Gestión de Push Notification
    $rootScope.$on('cloud:push:notification', function (event, data) {
      console.log(data)
      if (backgroundFactory.isActive()) {
        var alertPopup = $ionicPopup.alert({
          title: data.message.payload.title,
          template: data.message.payload.template
        })
        // var self = data
        alertPopup.then(function (res) {
          // Obtengo el badge de reservaciones
          clientDBO.get()
            .then(function successCallback (result) {
              if (result.length > 0) {
                switch (data.message.payload.tipo) {
                  case 1:
                    $state.go('tabsController.reservaciones', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  case 2:
                    $state.go('tabsController.buzon', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  case 3:
                    $state.go('tabsController.correspondencia', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  case 4:
                    $state.go('tabsController.envios', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  case 5:
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    })
                    $state.go('facturacion', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  case 6:
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    })
                    $state.go('miCuenta', {
                      idacta: result[0].idActa
                    }, {
                      reload: true
                    })
                    break
                  default:
                    $state.go('login')
                }

                // Pruebas
                console.log(data.message)

                $cordovaBadge.hasPermission().then(function (result) {
                  $cordovaBadge.set(value)
                }, function (error) {
                  alert(error)
                })
              }
            }, function errorCallback (err) {
              // OnError
              console.log(err)
            })
        })
      }
    })

    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({
        template: 'espere...'
      })
    })

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide()
    })

    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.$broadcast('loading:show')
    })

    $rootScope.$on('$stateChangeSuccess', function () {
      $rootScope.$broadcast('loading:hide')
    })

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault()
      }

      if (window.cordova) {
        // App syntax
        db = $cordovaSQLite.openDB({
          name: 'zenttremobile.db',
          iosDatabaseLocation: 'default'
        })
      } else {
        // Ionic serve syntax
        db = window.openDatabase('zenttremobile.db', '1.0', 'zenttre mobile', -1)
      }

      // Wait for open DB
      setTimeout(function () {
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS session(id integer primary key, token text, cliente text)')
          .then(function (res) {
            console.log('tabla session creada.')
          }, function (err) {
            console.log(err)
          })
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS client(id integer primary key, clase text,idCliente integer,idActa integer,idContrato integer,idTipo integer,tipo text,idSucursal integer,sucursal text,idEstatusContrato integer,estatusContrato text,razonSocial text,nombreComercial text,mailPrincipal text,paginaWeb text ,fechaInicio numeric,idTipoFiscal integer,tipoFiscal text,nombre text,idLE integer,LE text ,rfc text,lada text ,telefono text,cie text ,idEjecutivo integer,ejecutivo text,idOficina integer,oficina text,giroComercial text,fecha numeric,nota text,creditos numeric,usuario text,password text,cliente text)')
          .then(function (res) {
            console.log('tabla client creada.')
          }, function (err) {
            console.log(err)
          })
      }, 500)

      // Sets the theme to iOS and localization to German
      mobiscroll.settings = {
        theme: 'ios',
        lang: 'es'
      }
    })
  })

apps.config(function ($cordovaInAppBrowserProvider, $ionicCloudProvider) {
  $ionicCloudProvider.init({
    'core': {
      'app_id': '51ae5231'
    },
    'push': {
      'sender_id': '396796908373',
      'pluginConfig': {
        'ios': {
          'badge': true,
          'sound': true
        },
        'android': {
          'iconColor': '#343434'
        }
      }
    }
  })

  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  }

  // InApp Browser config
  $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions)
})
// apps.config(function ($ionicConfigProvider) {
//    $ionicConfigProvider.views.maxCache(0)
//
//    //    // note that you can also chain configs
//    //    $ionicConfigProvider.backButton.text('regresar').icon('ion-chevron-left')
// })

apps.directive('hideTabs', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      scope.$watch(attributes.hideTabs, function (value) {
        $rootScope.hideTabs = value
      })

      scope.$on('$destroy', function () {
        $rootScope.hideTabs = false
      })
    }
  }
})
