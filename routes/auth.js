const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function sessionAuthenticated(req) {
    return req.session.username !== undefined;
}

router.get('/login', async(req, res) => {
    if (sessionAuthenticated(req)) {
        res.render('auth/login', {
            error: 'You must log out from your current session before changing users'
        });
    } else {
        res.render('auth/login', {});
    }
});

router.post('/login', async(req, res) => {
    if (sessionAuthenticated(req)) {
        res.render('auth/login', {
            error: 'You must log out from your current session before changing users'
        });
    } else {
        const username = req.body.username;
        const password = req.body.password;

        try {
            valid = await users.loginValid(username, password);
            if (!valid) throw 'Incorrect password';

            req.session.username = username;
            res.redirect('/private');
        } catch (e) {
            res.status(401).render('auth/login', {
                title: "Login",
                error: e
            });
        }
    }
});

router.get('/logout', async(req, res) => {
    if (sessionAuthenticated(req)) {
        await req.session.destroy();
        res.render('auth/login', {
            error: 'You have been logged out'
        });
    } else {
        res.render('auth/login', {
            error: 'There is no session to log out from'
        });
    }
});

router.all('*', async(req, res, next) => {
    // Authentication middleware
    if (!sessionAuthenticated(req)) {
        res.status(403).render('auth/login', {
            error: 'You must log in to view private pages'
        });
    } else {
        next();
    }
});

module.exports = router;