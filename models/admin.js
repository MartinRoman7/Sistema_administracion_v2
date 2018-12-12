const mongoose = require('mongoose');
var Device = require("./device");

module.exports.getAllAdmin = function(query, callback) {
    console.log(query);
    Device.find(query, callback);
}

module.exports.searchCode = function(query, callback) {
    console.log(query);
    Device.find(query, callback);
}
