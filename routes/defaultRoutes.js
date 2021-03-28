const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const defaultController = require('../controllers/defaultController');


// for all routes, apply the default layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';
    next();
});

router.route('/')
    .get(defaultController.index);


// define local strategy with passport library
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},(req, email, password, done) => {
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return done(null, false, req.flash('error-message', 'User not found with this email.'));
            }

            bcrypt.compare(password, user.password, (err, passwordMatched) => {
                if (err) {
                    return err;
                }

                if (!passwordMatched) {
                    return done(null, false, req.flash('error-message', 'Invalid Username or Password'));
                }

                return done(null, user, req.flash('success-message', 'Login Successful'));
            });

        });
}));


// If authentication succeeds, a session will be established and maintained
// via a cookie set in the user's browser.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// make the local authentication in the router
router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }) ,defaultController.loginPost);

router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route('/post/:id')
    .get(defaultController.getSinglePost)
    .post(defaultController.submitComment);

router.route('/logout')
    .get(defaultController.logout)


module.exports = router;