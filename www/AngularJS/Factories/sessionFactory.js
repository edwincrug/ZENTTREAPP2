appServices.factory('sessionFactory', [function () {

    var interfaz = {};

    interfaz.cliente = null;
    interfaz.token = null;
    interfaz.multiple = null;

    //Obtiene el correo seleccionado para ver el detalle
    interfaz.currentMail = null;

    return interfaz;

}]);
