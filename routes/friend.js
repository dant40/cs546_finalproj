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
  let currentUser = await users.getByUsername(req.session.username);
  //currentUser.profile.friends -> [list of usernames], do this to get friendsList for displayname
  let friendsList = [];
  let usernamesList = currentUser.profile.friends;
  let friend = " "
  for(let i = 0; i < usernamesList.length; i++){
    try {
      friend = await users.getByUsername(usernamesList[i]);
    } catch (e) {
      console.log(e); //this is called when you have a friend in your friendsList that is not a User
      friend = " ";
    } finally {
      if(friend != " "){
        friendsList.push(friend);
      }
    }
  }
  res.render('friends/friends', {layout: 'nav', title:getPageTitle(req.session.username), friends: friendsList});
});

router.post('/add', async (req, res) => {
  let user2 = req.body.addFriend; //if added from form
  if(!user2) user2 = req.body.userName //if added from the button on their profile page
  try {
    let user = await users.addFriend(req.session.username, user2);
  } catch (e) { //something goes wrong with adding
    console.log(e);
  } finally {
    res.redirect('/friends');
  }
});

router.post('/remove', async (req, res) =>  {
  try {
    let user = await users.removeFriend(req.session.username, req.body.userName);
  } catch (e) { //something goes wrong with removing
    console.log(e);
  } finally {
    res.redirect('/friends');
  }
});

module.exports = router;
