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
    puesto: {
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
