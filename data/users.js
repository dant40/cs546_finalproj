    const mongoCollections = require("../config/collections.js");
    const users = mongoCollections.users;
    const ObjectID = require('mongodb').ObjectID;

    //contains following:
    //create user, delete user, get all users, get user by id
    // add post to user, delete post from user, change name in user profile
    //Not adding a get all post by user option, since posts already should be in a user
    //see database proposal document for reference

    //incoming password is expected to be hashed
    async function create(username,hashedPassword){
        if(name == undefined || hashedPassword == undefined)
            throw new Error ("Needs a username / password to create user")
            //not enforcing anything for password yet for testing
        if(typeof(name) !== 'string' )
            throw new Error ("Invalid input types!")

        var col = await users()
        //idk how sessionid should work
        var temp = {
            _id: ObjectID.generate(),
            username: username,
            hashedPassword: hashedPassword,
            sessionid: "",
            profile: emptyUserProfile(_id,username),
        }

        const insertInfo = await col.insertOne(temp);
        if (insertInfo.insertedCount === 0) 
            throw new Error ("Could not create user");
        return temp 
    }
    //helper method
    function emptyUserProfile(id,username){
        var prof = {
        _id: id,
        name: username,
        posts: []
        }
        return prof
    }

    async function getAll(){
        var col = await users();
        var cur = await col.find();
        return cur.toArray();
    }

    async function get(id){

        if(id === undefined)
            throw new Error ("Please enter an id")

        if(typeof(id)!== 'string')
            throw new Error ("Invalid id type!")

        var col = await users();
        var temp = await col.findOne({_id: ObjectID(id)})
        if(temp === null)
            throw new Error ("No users found")

        return temp;
    }

    async function remove(id){

        if(id === undefined)
            throw new Error ( "Please enter an id")

        if(typeof(id)!== 'string')
            throw new Error ( "Invalid id type!")

        var col = await users();
        var temp = await this.get(id)
        const deletionInfo = await col.removeOne(temp);

        if (deletionInfo.deletedCount === 0) {
            throw new Error (`Could not delete user with id of ${id}`);
        }
        var result = {
            deleted: true,
            data: temp
        }
        return result
    }

    async function setProfileName(id,newName){
        if(id === undefined || newName === undefined)
        throw new Error ("Please enter and id and a new name")
    
        if(typeof(id)!== 'string' || typeof(newName) !== 'string')
            throw new Error ("Invalid input type!")
    
        var col = await users();
        
        const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$set : {"profile.name": newName }});
            if (updateInfo.modifiedCount === 0) {
              throw new Error ( "Could not update animal successfully");
            }
        
        return await this.get(id);
    }
    //assumes post passed in is valid, post should be the entire object
    //EVERYTIME A POST IS MADE THIS SHOULD BE CALLED
    async function addPostToUser(id, post){
        if(id === undefined || post === undefined)
        throw new Error ("Please enter id and post")
    //doesn't enforce anything on the post as of now
        if(typeof(id)!== 'string')
            throw new Error ("Invalid input type!")
    
        var col = await users();
        
        const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$push : {"profile.posts": post }});
            if (updateInfo.modifiedCount === 0) {
              throw new Error ( "Could not perform post addition successfully");
            }
        
        return await this.get(id);
    }

    async function deletePostFromUser(id,post_id){
        if(id === undefined || post_id === undefined)
        throw new Error ("Please enter id and post_id")
    //doesn't enforce anything on the post as of now
      
    
        var col = await users();
        
        const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$pull : {"profile.posts": { $in: post} }});
            if (updateInfo.modifiedCount === 0) {
              throw new Error ( "Could not perform post deletion successfully");
            }
        
        return await this.get(id);
    }

    //For interal use by posts.js only
    async function updatePostById(id,newPost){
        if(id === undefined || newPost === undefined)
        throw new Error ("Please enter id and newPost")
        //doesn't enforce anything on the post as of now
        //This is a inefficient way of doing this, but it'll stay for now
        deletePostFromUser(id,newPost.id)
        addPostToUser(id,newPost)
        return await this.get(id);
    }

    module.exports = {
    create: create,
    getAll: getAll,
    get: get,
    remove: remove,
    setProfileName: setProfileName,
    addPostToUser: addPostToUser,
    deletePostFromUser: deletePostFromUser,
    updatePostById: updatePostById
    }