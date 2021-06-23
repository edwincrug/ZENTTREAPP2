appServices.factory('alertFactory', ['$ionicPopup', function ($ionicPopup) {

    var interfaz = {};

    interfaz.message = function (title, text) {
        $ionicPopup.alert({
            title: title,
            template: text
        });
    };

    interfaz.alert = function (type) {
        if (type == 2) {
            return {
                anchor: '#widgetMessage-show', // More info about anchor: https://docs.mobiscroll.com/3-0-0_beta4/angular/widget#!opt-anchor
                display: 'center',
                buttons: [{ // More info about buttons: https://docs.mobiscroll.com/3-0-0_beta4/angular/widget#!opt-buttons
                    text: 'aceptar',
                    handler: 'set'
                    }, {
                    text: 'cancelar',
                    handler: 'cancel'
                    }],
                onBeforeShow: function (event, inst) { // More info about onBeforeShow: https://docs.mobiscroll.com/3-0-0_beta4/angular/widget#!event-onBeforeShow
                    var s = inst.settings;

                    if (s.theme == 'wp' || s.baseTheme == 'wp') {
                        s.buttons[0].icon = 'checkmark';
                        s.buttons[1].icon = 'close';
                    }
                }
            }
        } else {
            return {
                anchor: '#widgetMessage-show', // More info about anchor: 
                display: 'center',
                buttons: [{ // More info about buttons
                    text: 'aceptar',
                    handler: 'set'
                    }],
                onBeforeShow: function (event, inst) { // More info about onBeforeShow: https://docs.mobiscroll.com/3-0-0_beta4/angular/widget#!event-onBeforeShow
                    var s = inst.settings;

                    if (s.theme == 'wp' || s.baseTheme == 'wp') {
                        s.buttons[0].icon = 'checkmark';
                        s.buttons[1].icon = 'close';
                    }
                }
            }
        }

    };

    return interfaz;

}]);
