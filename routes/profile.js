const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function getPageTitle(username) {
    return `${username}'s Profile`;
}

router.get('/profile', async(req, res) => {
  let user = await users.getByUsername(req.session.username);
  res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.session.username), profile: user});
});

router.get('/profile/:user', async(req, res) => {
  console.log()
  let user = await users.getByUsername((req.params.user));
  res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.params.user), profile: user});
});

module.exports = router;
