const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const posts= data.posts;


router.get('/newPost', async(req, res) => {
    res.render('posting/post', {layout: 'nav', user: req.session._id});
});

router.post('/makePost', async(req, res) => {
 
        const content = {
            text: "",
            img: "",
        };
        const user = "";
        if(req.body.user !== undefined)
            user = req.body.user
        if(req.body.postBody !== undefined)
            content.text = req.body.postBody
        if(req.body.postBodyImage !== undefined)
            content.img = req.body.postBodyImage
        console.log(req.session._id)
        const post = await posts.create(user,content)    
        const updatedUser = await users.addPostToUser(user,post)     
        // Redirects the post request including the form content, so the login request should succeed.
        res.redirect('/profile');
    
})

module.exports = router;