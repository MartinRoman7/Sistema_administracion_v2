const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Esquema de usuario
var ResponsableSchema = mongoose.Schema({
    codigo: {
        type: String
    },
    name: {
        type: String
    },
    cargo: {
        type: String
    },
    email: {
        type: String
    },
    movil: {
        type: String
    },
    fijo: {
        type: String
    }
});

// Apartado de directorio /routes
var Responsable = module.exports = mongoose.model('Responsable', ResponsableSchema);

module.exports.createResponsable = function(arr, callback) {
    Responsable.insertMany(arr, callback);
}

module.exports.getAllAdmin = function(query, callback) {
    console.log(query);
    Responsable.find(query, callback);
}