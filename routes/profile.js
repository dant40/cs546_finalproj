const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

router.get('/profile', async(req, res) => {
    res.render('profile/profile', {layout: 'nav'});
});

module.exports = router;