const express = require('express');
const router = express.Router();

// Página principal
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
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