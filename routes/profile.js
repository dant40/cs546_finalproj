const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function getPageTitle(username) {
    return `${username}'s Profile`;
}

router.get('/profile', async(req, res) => {
  let user = await users.getByUsername(req.session.username);
  res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.session.username), profile: user, notYou: false});
});

router.get('/profile/:userName', async(req, res) => { 
  let user = await users.getByUsername((req.params.userName));
  res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.params.userName), profile: user, notYou: true});
});

module.exports = router;
