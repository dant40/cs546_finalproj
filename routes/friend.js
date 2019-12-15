const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function getPageTitle(username) {
    return `${username}'s Friends`;
}

router.get('/friends', async (req, res) => {
  let friendsList = await users.getByUsername(req.session.username).friends;
  res.render('friends/friends', {layout: 'nav', title:getPageTitle(req.session.username), friends: friendsList});
});

router.post('/add/:userName', async (req, res) =>  {
  try {
    let user = await users.addFriend(await users.getByUsername(req.session.username), await users.getByUsername(req.params.userName));
  } catch (e) { //something goes wrong with adding
    console.log(e);
  } finally {
    res.redirect('/friends');
  }
});

router.post('/add/:userName', async (req, res) =>  {
  try {
    let user = await users.removeFriend(await users.getByUsername(req.session.username), await users.getByUsername(req.params.userName));
  } catch (e) { //something goes wrong with removing
    console.log(e);
  } finally {
    res.redirect('/friends');
  }
});

module.exports = router;
