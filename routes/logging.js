const express = require('express');
const router = express.Router();

router.all('*', async(req, res, next) => {
    userAuthenticated = req.session.username;
    message = `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${userAuthenticated?'Authenticated':'Non-authenticated'} user)`
    console.log(message);
    next();
});

module.exports = router;