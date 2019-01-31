const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://<Usuario de mongo>:<Contraseña de mongo>@localhost:27017/<Nombre de DB>"


// Estado - Jurisdicción
router.get('/database/estado/jurisdiccion/:id', (req, res) => {

    let id = req.params.id;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_ENTIDAD": id } }, { $group: { _id: { Jurisdiccion: "$CLUES_JURISDICCIÓN" } } }, { $sort: { "_id.Jurisdiccion": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Estado - Municipios
router.get('/database/estado/municipio/:id', (req, res) => {

    let id = req.params.id;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_ENTIDAD": id } }, { $group: { _id: { Municipio: "$CLUES_MUNICIPIO" } } }, { $sort: { "_id.Municipio": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Estado, Jurisdicción - Municipios
router.get('/database/estado-jurisdiccion/municipio/:est&:juris', (req, res) => {

    let estado = req.params.est;
    let jurisdiccion = req.params.juris;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_ENTIDAD": estado, "CLUES_JURISDICCIÓN": jurisdiccion } }, { $group: { _id: { Municipio: "$CLUES_MUNICIPIO" } } }, { $sort: { "_id.Municipio": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Jurisdicción - Localidades
router.get('/database/jurisdiccion/localidad/:id', (req, res) => {

    let id = req.params.id;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_JURISDICCIÓN": id } }, { $group: { _id: { Localidad: "$CLUES_LOCALIDAD" } } }, { $sort: { "_id.Localidad": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});


// Estado, Municipio - Jurisdicción
router.get('/database/estado-municipio/jurisdiccion/:est&:mun', (req, res) => {

    let estado = req.params.est;
    let municipio = req.params.mun;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_ENTIDAD": estado, "CLUES_MUNICIPIO": municipio } }, { $group: { _id: { Jurisdiccion: "$CLUES_JURISDICCIÓN" } } }, { $sort: { "_id.Jurisdiccion": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Municipio - Localidades
router.get('/database/municipio/localidad/:id', (req, res) => {

    let id = req.params.id;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_MUNICIPIO": id } }, { $group: { _id: { Localidad: "$CLUES_LOCALIDAD" } } }, { $sort: { "_id.Localidad": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Jurisdicción, Muncipio - Localidades
router.get('/database/jurisdiccion-municipio/localidad/:juris&:mun', (req, res) => {

    let jurisdiccion = req.params.juris;
    let municipio = req.params.mun;

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_MUNICIPIO": municipio, "CLUES_JURISDICCIÓN": jurisdiccion } }, { $group: { _id: { Localidad: "$CLUES_LOCALIDAD" } } }, { $sort: { "_id.Localidad": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

// Jurisdicción, Muncipio, Localidad - Unidad de Salud, CLUES
router.get('/database/jurisdiccion-municipio-localidad/us-clues/:juris&:mun&:loc', (req, res) => {

    let jurisdiccion = req.params.juris;
    let municipio = req.params.mun;
    let localidad = req.params.loc;
    console.log(jurisdiccion + " " + municipio + " " + localidad);

    MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var dbo = client.db("system_admin");
        dbo.collection("clues").aggregate([{ "$match": { "CLUES_MUNICIPIO": municipio, "CLUES_JURISDICCIÓN": jurisdiccion, "CLUES_LOCALIDAD": localidad } }, { $group: { _id: { Unidad: "$NOMBRE DE LA UNIDAD", CLUES: "$CLUES" } } }, { $sort: { "_id.Unidad": 1, "_id.CLUES": 1 } }]).toArray(function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
            client.close();
        });
    });

});

module.exports = router;
