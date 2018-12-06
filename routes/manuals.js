const express = require('express');
const router = express.Router();

router.get('/refrigerador/configuracion-01', ensureAuthenticated, (req, res) => {
    res.sendFile('/home/martin/Documents/Sistema_administracion_v2/manuals/http-response-codes-01.pdf')
});

router.get('/refrigerador/configuracion-02', ensureAuthenticated, (req, res) => {
    res.sendFile('/home/martin/Documents/Sistema_administracion_v2/manuals/http-response-codes-02.pdf')
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;