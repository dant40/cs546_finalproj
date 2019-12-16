const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

async function sessionAuthenticated(req) {
    const cookieValid = req.cookies.AuthCookie && req.session.username;
    try {
        const sessionValid = await users.isSessionValid(req.session.username, req.session.id);
        return cookieValid && sessionValid;
    } catch(e) {
        console.log(e);
        return false;
    }
}

function redirectToDefault(res) {
    res.redirect('/profile');
}

// Register
router.get('/register', async(req, res) => {
    if (await sessionAuthenticated(req)) {
        redirectToDefault(res);
    } else {
        res.render('auth/register', {});
    }
});
router.post('/register', async(req, res) => {
    if (await sessionAuthenticated(req)) {
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
        const user = await users.create(username, fullName, password);

        // Redirects the post request including the form content, so the login request should succeed.
        res.redirect('/login');
    }
});

// Login
router.get('/login', async(req, res) => {
    if (await sessionAuthenticated(req)) {
        redirectToDefault(res);
    } else {
        res.render('auth/login', {});
    }
});
router.post('/login', async(req, res) => {
    if (await sessionAuthenticated(req)) {
        res.status(403);
    } else {
        const username = req.body.username;
        const password = req.body.password;
        if (password == null || password == undefined) password = '';

        try {
            await users.newSession(username, password, req.session.id)
            req.session.username = username;
            redirectToDefault(res);
        } catch (e) {
            res.status(401).render('auth/login', {
                error: e
            });
        }
    }
});

// Logout
router.get('/logout', async(req, res) => {
    if (await sessionAuthenticated(req)) {
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

// Authentication middleware
router.all('*', async(req, res, next) => {
    const auth = await sessionAuthenticated(req);
    if (!auth) {
        res.status(403).render('auth/login', {
            error: 'You must log in to view private pages'
        });
    } else {
        next();
    }
});

module.exports = router;
