const mongoose = require('mongoose');


// Esquema de dispositivo
var DeviceSchema = mongoose.Schema({
    // Agregar apartado de cámara de frío
    codigo: {
        type: String,
        index: true
    },
    clues: {
        type: String
    },
    estado: {
        type: String
    },
    jurisdiccion: {
        type: String
    },
    municipio: {
        type: String
    },
    localidad: {
        type: String
    },
    unidad: {
        type: String
    },
    config: {
        type: String
    }
    /*
    camara: {
        type: String // Se debe indicar entre la selección de Unidad de Salud o Cámara de frío
    },
    config: {
        type: String // Número que va a corresponder a la configuración seleccionada
                     // con base en la selección de Unidad de Salud o Cámara de frío
    }
    */
});

var Device = module.exports = mongoose.model('Device', DeviceSchema);

module.exports.getDeviceByCode = function(id, callback) {
    console.log(id);
    var query = { codigo: id.codigo };
    Device.findOne(query, callback);
}

module.exports.insertDevice = function(arr, callback) {
    Device.insertMany(arr, callback);
}