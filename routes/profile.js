const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function getPageTitle(req) {
    return `${req.session.username}'s Profile`;
}

router.get('/profile', async(req, res) => {
  let user = await users.get(req.session.username);
  res.render('profile/profile', {layout: 'nav', title: getPageTitle(req), profile: user});
});

module.exports = router;
