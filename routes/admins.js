const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://mongodb:FundacionCSMongoDB@138.68.47.27:27017/system_admin"

const Admins = require('../models/admin');

router.get('/', ensureAuthenticated, (req, res) => {

    Admins.getAllAdmin({}, (err, data) => {
        if (err) throw err;
        console.log(data);

        res.render('admin', { datas: data });

    });
});

router.post('/search', ensureAuthenticated, (req, res) => {
    //var id = req.url;
    //console.log(id);
    //var codigo_clear = id.replace('/search?codigoSearch=','');
    var codigo_clear = req.body.codigoSearch;

    Admins.searchCode({codigo: codigo_clear}, (err, result) => {
        if (err) throw err;
        if (result.length){ 
            console.log('Código encontrado');
            res.render('admin', { datas: result });
          } else{
            
            Admins.getAllAdmin({}, (err, data) => {
                if (err) throw err;
                console.log(data);
                var errors_arr = [];
                errors_arr.push( { msg: 'No existe código en la DB' } );
                var errors = JSON.stringify(errors_arr);
        
                res.render('admin', { datas: data, errors: errors });
        
            });
          }
    });

});

router.get('/asignacion', ensureAuthenticated, (req, res) => {
    var id = req.url;
    console.log(id);
    var codigo = id.replace('/asignacion?codigoTable=','');
    

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin"); 
        dbo.collection("clues").aggregate([{ $group: { _id: "$CLUES_ENTIDAD" }},{ $sort : { "_id": 1 } }]).toArray(function(err, result_entidad) {
          if (err) throw err;
          else{
            res.render('asignacion', { codigos: codigo, estados: result_entidad});
          }
        });
        });
});

router.post('/asignacion', ensureAuthenticated, (req, res) => {
    let body = req.body;
    console.log(body);

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
        else{
          console.log(result);
          res.redirect('/admin');
          }
        });
        client.close();
      });

});

router.get('/configuracion/:id', ensureAuthenticated, (req, res) => {
    var params = req.params.id;
    console.log("params: "+params);
    /*var url = req.url;
    console.log("url: "+url);*/
    res.render('configuracion');

    
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg', 'No estás logeado');
        res.redirect('/users/login');
    }
}

module.exports = router;
