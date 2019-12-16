const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;

function getPageTitle(username) {
    return `${username}'s Profile`;
}

router.get('/profile', async(req, res) => {
	if (!req.query || !req.query.userName || req.query.userName === "" || req.query.userName === req.session.username) {
		let user = await users.getByUsername(req.session.username);
  		if (user.profile.bio == "") {
  			user.profile.bio = "We see you have not entered a bio, would you like to enter one?";
  		}
  		res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.session.username), profile: user, notYou: false});
	} else {
		let user = await users.getByUsername(req.query.userName);
		if (user.profile.bio == "") {
			user.profile.bio = "This user has not inputted a bio about themselves";
		}
		res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.query.userName), profile: user, notYou: true});
	}

});

router.post('/editBio', async(req, res) => {
	let user = await users.getByUsername((req.session.username));
	let bio = await users.editBio(req.session.username, req.body.bioInfo);
	res.redirect('/profile');
});

module.exports = router;
