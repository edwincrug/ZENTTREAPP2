appServices.factory('clientDBO', function ($cordovaSQLite, dbFactory) {
    var self = this;

    self.get = function () {
        return dbFactory.query("SELECT clase,idCliente,idActa,idContrato,idTipo,tipo ,idSucursal,sucursal,idEstatusContrato,estatusContrato,razonSocial,nombreComercial ,mailPrincipal,paginaWeb ,fechaInicio,idTipoFiscal ,tipoFiscal,nombre,idLE,LE ,rfc,lada ,telefono,cie ,idEjecutivo,ejecutivo,idOficina,oficina ,giroComercial,fecha,nota,creditos,usuario,password,cliente FROM client")
            .then(function (result) {
                return dbFactory.getAll(result);
            });
    };

    self.add = function (clientobj) {
        //Asigno los parámetros
        var parameters = Object.keys(clientobj).map(function (k) {
            return clientobj[k]
        });

        //Inserto el objeto
        return dbFactory.query("INSERT INTO client(clase,idCliente,idActa,idContrato,idTipo,tipo ,idSucursal,sucursal,idEstatusContrato,estatusContrato,razonSocial,nombreComercial ,mailPrincipal,paginaWeb ,fechaInicio,idTipoFiscal ,tipoFiscal,nombre,idLE,LE ,rfc,lada ,telefono,cie ,idEjecutivo,ejecutivo,idOficina,oficina ,giroComercial,fecha,nota,creditos,usuario,password,cliente)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", parameters);
    };


    self.removeAll = function () {
        return dbFactory.query("DELETE FROM client");
    };

    return self;

});
