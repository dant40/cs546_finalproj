const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

//TODO for tomorrow
// fix button on other's profiles
//do remove stuff
//fix friends.handlebars
//handle bad inputs
//make the UI pretty

function getPageTitle(username) {
    return `${username}'s Friends`;
}


router.get('/friends', async (req, res) => {
  //console.log("made it here");
  let friendsList = await users.getByUsername(req.session.username).friends;
  res.render('friends/friends', {layout: 'nav', title:getPageTitle(req.session.username), friends: friendsList});
});

router.post('/add', async (req, res) => {
  //req.body.addFriend if submited through form
  //res.redirect('/add/' + req.body.addFriend);
  try {
    let user = await users.addFriend(await users.getByUsername(req.session.username), await users.getByUsername(req.body.addFriend));
  } catch (e) { //something goes wrong with adding
    console.log(e);
  } finally {
    //console.log("finished the function");
    res.redirect('/friends');
  }
});

// router.post('/add/:userName', async (req, res) =>  {
//   console.log("made it here");
//   try {
//     let user = await users.addFriend(await users.getByUsername(req.session.username), await users.getByUsername(req.params.userName));
//   } catch (e) { //something goes wrong with adding
//     console.log(e);
//   } finally {
//     console.log("finished the function");
//     res.redirect('/friends');
//   }
// });

router.post('/remove/:userName', async (req, res) =>  {
  try {
    let user = await users.removeFriend(await users.getByUsername(req.session.username), await users.getByUsername(req.params.userName));
  } catch (e) { //something goes wrong with removing
    console.log(e);
  } finally {
    res.redirect('/friends');
  }
});

module.exports = router;
