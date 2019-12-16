const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const posts = data.posts;

function getPageTitle(username) {
    return `${username}'s Profile`;
}

router.get('/profile', async(req, res) => {
	if (!req.query || !req.query.userName || req.query.userName === "" || req.query.userName === req.session.username) {
		let user = await users.getByUsername(req.session.username);
		let postList = await posts.getAllPostsByPosterId(user._id);
		postList = postList.reverse();
  		if (user.profile.bio == "") {
  			user.profile.bio = "We see you have not entered a bio, would you like to enter one?";
  		}
  		res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.session.username), profile: user, notYou: false, posts: postList});
	} else {
		let user = await users.getByUsername(req.query.userName);
		let postList = await posts.getAllPostsByPosterId(user._id);
		postList = postList.reverse();
		if (user.profile.bio == "") {
			user.profile.bio = "This user has not inputted a bio about themselves";
		}
		res.render('profile/profile', {layout: 'nav', title: getPageTitle(req.query.userName), profile: user, notYou: true, posts: postList});
	}

});

router.post('/editBio', async(req, res) => {
	let user = await users.getByUsername((req.session.username));
	let bio = await users.editBio(req.session.username, req.body.bioInfo);
	res.redirect('/profile');
});

router.post('/newPost', async(req, res) => {
	let user = await users.getByUsername((req.session.username));
	let post = await posts.create(user._id, req.body.newPost);
	console.log(user);
	await users.addPostToUser(user._id, post._id);
	res.redirect('/profile');
});

router.post('/deletePost', async(req, res) => {
	let post = await posts.get(req.body.postId);
	let deletedPost = await users.deletePostFromUser(post.author, post._id);
	let removedPost = await posts.remove(post._id);
	res.redirect('/profile');
});

router.post('/commentOnPost', async(req,res) => {
	let post = await posts.get(req.body.postId)
	console.log(req.session.username)
	const comment = {
		content: req.body.comment,
		author: req.session.username
	}
	const newPost = await posts.commentOnPostById(post._id,comment)
	await users.updatePostById(post.author,newPost)
	res.redirect('back');
})
router.post('/likePost', async(req, res) => {
	let post = await posts.get(req.body.postId);
	let getCurrUser = await users.getByUsername(req.session.username);
	let alreadyLiked = false;
	for (let i = 0; i < post.likes.likedBy.length; i++) {
		if (post.likes.likedBy[i] === getCurrUser.username) {
			alreadyLiked = true;
		}
	}
	if (alreadyLiked) {
		let liked = await posts.unlikePostById(post._id, getCurrUser.username);
	} else {
		let liked = await posts.likePostById(post._id, getCurrUser.username);
	}
	res.redirect('back');
});

module.exports = router;
