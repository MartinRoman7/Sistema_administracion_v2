const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://<Usuario de mongo>:<Contraseña de mongo>@127.0.0.1:27017/<Nombre de DB>"

const Admins = require('../models/admin');
const Responsable = require('../models/responsable');

router.get('/', ensureAuthenticated, (req, res) => {

    Admins.getAllAdmin({}, (err, data) => {
        if (err) throw err;
        console.log(data);

        res.render('admin', { datas: data });

    });
});

router.post('/search', ensureAuthenticated, (req, res) => {
    var codigo_clear = req.body.codigoSearch;

    Admins.searchCode({ codigo: codigo_clear }, (err, result) => {
        if (err) throw err;
        if (result.length) {
            console.log('CÃ³digo encontrado');
            res.render('admin', { datas: result });
        } else {

            Admins.getAllAdmin({}, (err, data) => {
                if (err) throw err;
                console.log(data);
                var errors_arr = [];
                errors_arr.push({ msg: 'No existe cÃ³digo en la DB' });
                var errors = JSON.stringify(errors_arr);

                res.render('admin', { datas: data, errors: errors });

            });
        }
    });

});

router.get('/asignacion', ensureAuthenticated, (req, res) => {
    var id = req.url;
    console.log(id);
    var codigo = id.replace('/asignacion?codigoTable=', '');


    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ $group: { _id: "$CLUES_ENTIDAD" } }, { $sort: { "_id": 1 } }]).toArray(function(err, result_entidad) {
            if (err) throw err;
            else {
                res.render('asignacion', { codigos: codigo, estados: result_entidad });
            }
        });
    });
});

router.post('/asignacion', ensureAuthenticated, (req, res) => {
    let body = req.body;
    console.log(body);

    // Agregar apartado de cÃ¡mara de frÃ­o
    let estado = body.estado;
    let municipio = body.municipio;
    let jurisdiccion = body.jurisdiccion;
    let localidad = body.localidad;
    let unidad = body.unidad;
    let clues = body.clues;
    let codigo = body.codigo;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");

        var myquery = { codigo: codigo };
        var newvalues = { $set: { estado: estado, municipio: municipio, jurisdiccion: jurisdiccion, localidad: localidad, unidad: unidad, clues: clues } };

        dbo.collection("devices").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            else {
                console.log(result);
                res.redirect('/administrador');
            }
        });
        client.close();
    });

});

router.get('/configuracion/:id', ensureAuthenticated, (req, res) => {
    var params = req.params;

    var codigo_clear = params.id;
    console.log("params: " + codigo_clear);

    var id = req.url;
    console.log(id);
    var configuracion = id.replace('/configuracion/'+codigo_clear+'?configOption=', '');
    var len_config = configuracion.length;
    console.log("config: " + configuracion);
    console.log("config len: " + len_config);

    if(len_config > 2){
        Admins.searchCode({ codigo: codigo_clear }, (err, result) => {
            if (err) throw err;
            console.log('CÃ³digo encontrado');
            console.log(result);
            console.log(result[0].unidad);
            var unidad_content = result[0].unidad;
            if (unidad_content === null) {
                // CÃ¡mara de frÃ­o
                res.render('configuracion-cf', { codigos: codigo_clear });
            } else {
                // Refrigerador
                res.render('configuracion-refrigerador', { codigos: codigo_clear });
            }
        });
   } else{
        MongoClient.connect(url, function(err, client) {
            if (err) throw err;
            var dbo = client.db("system_admin");
    
            var myquery = { codigo: codigo_clear };
            var newvalues = { $set: { config: configuracion } };
    
            dbo.collection("devices").updateOne(myquery, newvalues, function(err, result) {
                if (err) throw err;
                else {
                    console.log(result);
                    res.redirect('/administrador');
                }
            });
            client.close();
        });
    }

});


router.get('/responsables', ensureAuthenticated, (req, res) => {
    var id = req.url;
    console.log(id);
    var codigo_clear = id.replace('/responsables?codigoTable=', '');

    Responsable.searchResponsable({ codigo: codigo_clear }, (err, data) => {
        if (err) throw err;
        console.log('CÃ³digo encontrado');
        res.render('responsables', { codigos: codigo_clear, datas: data });
    });

});

router.post('/responsables', ensureAuthenticated, (req, res) => {
    var url = req.url;
    console.log('url: '+url);

    var body = req.body;
    console.log('body: '+body)

});

router.get('/responsables/agregar', ensureAuthenticated, (req, res) => {
    var id = req.url;
    console.log(id);
    var codigo = id.replace('/responsables/agregar?codigoTable=', '');

    res.render('register_respon', { codigos: codigo });

});

router.post('/responsables/agregar', ensureAuthenticated, (req, res) => {
    var id = req.body;
    console.log(id);

    var codigo = id.codigoTable;
    var name = id.name;
    var username = id.username;
    var cargo = id.cargo;
    var email = id.email;
    var movil = id.movil;
    var fijo = id.fijo;

    // ValidaciÃ³n
    req.checkBody('name', 'Nombre es requerido').notEmpty();
    req.checkBody('username', 'Username es requerido').notEmpty();
    req.checkBody('cargo', 'Cargo es requerido').notEmpty();
    req.checkBody('email', 'Email es requerido').notEmpty();
    req.checkBody('email', 'Email no valido').notEmpty();
    req.checkBody('movil', 'NÃºmero mÃ³vil es requerido').notEmpty();
    req.checkBody('fijo', 'NÃºmero fijo es requerido').notEmpty();

    var errors = req.validationErrors();

    console.log(errors);

    // Si hay errores muestralos en el layout
    if (errors) {
        res.render('register_respon', {
            errors: errors
        });
    } else {
        const newResponsable = new Responsable ({
            codigo: codigo,
            name: name,
            username, username,
            cargo: cargo,
            email: email,
            movil: movil,
            fijo: fijo
        });

        Responsable.createResponsable(newResponsable, (err, responsable) => {
            if (err) throw err;
            console.log(responsable);
        });

        req.flash('success_msg', 'Registro Ã©xitoso');
        res.redirect('/administrador/responsables?codigoTable='+codigo);
    }

});

router.get('/responsables/modificar', ensureAuthenticated, (req, res) => {
    var id = req.url;
    console.log(id);
    var username_clear = id.replace('/responsables/modificar?usernameResponsable=', '');


    Responsable.searchResponsable({ username: username_clear }, (err, data) => {
        if (err) throw err;
        console.log('Username encontrado');
        res.render('modify_respon', { usernames: username_clear ,datas: data });
    });

});

router.post('/responsables/modificar', ensureAuthenticated, (req, res) => {
    let body = req.body;
    console.log(body);

    // Agregar apartado de cÃ¡mara de frÃ­o
    let name = body.name;
    let cargo = body.cargo;
    let movil = body.movil;
    let fijo = body.fijo;
    let email = body.email;
    let codigo = body.codigo;
    let username= body.usernameResponsable;
    
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");

        var myquery = { username: username };
        var newvalues = { $set: { name: name, cargo: cargo, email: email, movil: movil, fijo: fijo } };

        dbo.collection("responsables").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            console.log(result);
            req.flash('success_msg', 'ModificaciÃn Ã©xitoa');
            res.redirect('/administrador/responsables?codigoTable='+codigo);
            
        });
        client.close();
    });

});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;
