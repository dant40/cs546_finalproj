const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function sessionAuthenticated(req) {
    return req.session.username !== undefined;
}

function redirectToDefault(res) {
    res.redirect('/profile');
}

// Register
router.get('/register', async(req, res) => {
    if (sessionAuthenticated(req)) {
        redirectToDefault(res);
    } else {
        res.render('auth/register', {});
    }
});
router.post('/register', async(req, res) => {
    if (sessionAuthenticated(req)) {
        res.status(403);
    } else {
        const names = [];
        if (req.body.firstName !== undefined) names.push(req.body.firstName)
        if (req.body.midName !== undefined) names.push(req.body.midName);
        if (req.body.lastName !== undefined) names.push(req.body.lastName);
        const fullName = ( names.length==0 ? undefined : names.join(' ') );

        const username = req.body.username;
        const password = req.body.password;
        // TODO enforce username is unique
        const user = await users.create(username, fullName, password)

        res.redirect('/login');
    }
});

// Login
router.get('/login', async(req, res) => {
    if (sessionAuthenticated(req)) {
        redirectToDefault(res);
    } else {
        res.render('auth/login', {});
    }
});
router.post('/login', async(req, res) => {
    if (sessionAuthenticated(req)) {
        res.status(403);
    } else {
        const username = req.body.username;
        const password = req.body.password;

        try {
            valid = await users.validLogin(username, password);
            if (!valid) throw 'Incorrect password';

            req.session.username = username;
            redirectToDefault(res);
        } catch (e) {
            res.status(401).render('auth/login', {
                title: "Login",
                error: e
            });
        }
    }
});

// Logout
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

// Authentication
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