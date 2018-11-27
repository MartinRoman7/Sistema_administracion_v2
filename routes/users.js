const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user')

// Página de registro
router.get('/registro', (req, res) => {
    res.render('register');
});

// Página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Registro de usuario
router.post('/registro', (req, res) => {

    // Obtener los datos ingresados
    var id = req.body;
    var name = id.name;
    var username = id.username;
    var email = id.email;
    var password = id.password;
    var password2 = id.password2;

    console.log(id);

    // Validación
    req.checkBody('name', 'Nombre es requerido').notEmpty();
    req.checkBody('email', 'Email es requerido').notEmpty();
    req.checkBody('email', 'Email no valido').notEmpty();
    req.checkBody('username', 'Username es requerido').notEmpty();
    req.checkBody('password', 'Contraseña es requerida').notEmpty();
    req.checkBody('password2', 'Contraseñas no coinciden').equals(req.body.password);

    var errors = req.validationErrors();

    // Si hay errores muestralos en el layout
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });

        User.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'Registro éxitoso');

        res.redirect('/users/login');

    }

});

// Login
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Usuario invalido' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Contraseña invalida' });
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

// Logout session
router.get('/logout', (req, res) => {
    req.logout();

    req.flash('success_msg', 'Se ha cerrado sesión');

    res.redirect('/users/login');
})

module.exports = router;