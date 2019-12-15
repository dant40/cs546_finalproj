const mongoCollections = require("../config/collections.js");
const users = mongoCollections.users;
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltRounds = 16;

//contains following:
//create user, delete user, get all users, get user by id
// add post to user, delete post from user, change name in user profile
//Not adding a get all post by user option, since posts already should be in a user
//see database proposal document for reference

// displayname is an optional argument, and will default to the value of username
async function create(username,displayname,password) {
    if(!username || !password)
        return Promise.reject("Needs a username / password to create user");
        //not enforcing anything for password yet for testing
    if(typeof(username) !== 'string' || (typeof(displayname)!=='undefined' && typeof(displayname)!=='string'))
        return Promise.reject("Invalid input types!");

    if (!displayname) displayname = username;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    var col = await users()
    //idk how sessionid should work
    const _id = new ObjectID()
    var temp = {
        _id: _id,
        username: username,
        displayname: displayname,
        hashedPassword: hashedPassword,
        sessionid: "",
        profile: emptyUserProfile(_id,username),
    }

    const insertInfo = await col.insertOne(temp);
    if (insertInfo.insertedCount === 0)
        return Promise.reject("Could not create user");
    return temp
}

//helper method
function emptyUserProfile(id,username,displayname) {
    var prof = {
        _id: id,
        username: username,
        name: displayname,
        posts: [],
        friends: [] //list of friends I am adding it here stores usernames
    }
    return prof;
}

async function validLogin(username, password) {
    if (!username) return Promise.reject('No username provided');
    if (!password) return Promise.reject('No password provided');

    user = await this.getByUsername(username);
    passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    return passwordCorrect;
}

async function getAll() {
    var col = await users();
    var cur = await col.find();
    return cur.toArray();
}

async function get(id) {
    if(id === undefined)
        return Promise.reject("Please enter an id");

    var col = await users();
    var temp = await col.findOne({_id: ObjectID(id)})
    if(temp === null)
        return Promise.reject("No users found");

    return temp;
}

async function getByUsername(username) {
    if (!username) return Promise.reject('No username provided');
    const col = await users();
    const result = await col.findOne({username: username});
    if (result === null)
        return Promise.reject('No users found');
    return result;
}

//function to search for displayname used in post /search, max is the max number of results
async function getByDisplayname(displayname, max){
  if (!displayname) return Promise.reject('No displayname provided');
  const col = await users();
  return await col.find({"displayname": new RegExp(displayname, 'i')}).toArray();
}

async function remove(id) {
    if(id === undefined)
        return Promise.reject("Please enter an id");

    var col = await users();
    var temp = await this.get(id)
    const deletionInfo = await col.removeOne(temp);

    if (deletionInfo.deletedCount === 0) {
        return Promise.reject(`Could not delete user with id of ${id}`);
    }
    var result = {
        deleted: true,
        data: temp
    }
    return result
}

async function setProfileName(id,newName) {
    if(id === undefined || newName === undefined)
        return Promise.reject("Please enter and id and a new name");

    if( typeof(newName) !== 'string')
        return Promise.reject("Invalid input type!");

    var col = await users();

    const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$set : {"profile.name": newName }});
    if (updateInfo.modifiedCount === 0) {
        return Promise.reject("Could not update user successfully");
    }

    return await this.get(id);
}

//assumes post passed in is valid, post should be the entire object
//EVERYTIME A POST IS MADE THIS SHOULD BE CALLED
async function addPostToUser(id, post) {
    if(id === undefined || post === undefined)
        return Promise.reject("Please enter id and post");
//doesn't enforce anything on the post as of now

    var col = await users();

    const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$push : {"profile.posts": post }});
    if (updateInfo.modifiedCount === 0) {
        return Promise.reject( "Could not perform post addition successfully");
    }
    try {
        return await this.get(id);
    }
    catch(e) {return;}
}

async function deletePostFromUser(id,post_id){
    if( id === undefined || post_id === undefined)
        return Promise.reject("Please enter id and post_id");
//doesn't enforce anything on the post as of now

    var col = await users();

    const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$pull : {"profile.posts":  {_id: post_id } } });
    if (updateInfo.modifiedCount === 0) {
        throw new Error ( "Could not perform post deletion successfully");
    }
    try {
        return await this.get(id);
    }
    catch(e) {return;}

}

//MUST BE CALLED WHENEVER POST IS LIKED OR COMMENTED ON
async function updatePostById(id,newPost){
    if (id === undefined || newPost === undefined)
        return Promise.reject("Please enter id and newPost");
    //doesn't enforce anything on the post as of now
    //This is a inefficient way of doing this, but it'll stay for now
    deletePostFromUser(id,newPost._id);
    addPostToUser(id,newPost);
    return await this.get(id);
}

//FRIENDS
//user1 is adding user2 to its list of friends
async function addFriend(user1, user2){
  if(user1 === undefined || user2 === undefined){
    return Promise.reject("user1 or user2 is undefined");
  }
  try{
    getByUsername(user2);
  }catch (e) {
    return Promise.reject('No users2 not found; you cannot add a friend that does not exist.');
  }
  const col = await users();
  const updateInfo = await col.updateOne({username: user1},
    {$set : {"profile.friends": getByUsername(user1).profile.friends.push(user2)}});
  if (updateInfo.modifiedCount === 0) {
      return Promise.reject( "Could not perform adding friend operation successfully");
  }
  return getByUsername(user1);
}

//helper function to remove a value from an array
function arrayRemove(arr, value) {
   return arr.filter(function(ele){
       return ele != value;
   });
}

//User1 is removing user2 from its list of friends
async function removeFriend(user1, user2){
  if(user1 === undefined || user2 === undefined){
    return Promise.reject("user1 or user2 is undefined");
  }
  try{
    getByUsername(user2);
  }catch (e) {
    return Promise.reject('No users2 not found; you cannot remove a friend that does not exist.');
  }
  const col = await users();
  const updateInfo = await col.updateOne({username: user1},
    {$set : {"profile.friends": arrayRemove(getByUsername(user1).profile.friends, user2)}});
  if (updateInfo.modifiedCount === 0) {
      return Promise.reject( "Could not perform removing friend operation successfully");
  }
  return getByUsername(user1);
}

module.exports = {
    create: create,
    validLogin: validLogin,
    getAll: getAll,
    get: get,
    remove: remove,
    setProfileName: setProfileName,
    addPostToUser: addPostToUser,
    deletePostFromUser: deletePostFromUser,
    updatePostById: updatePostById,
    getByDisplayname: getByDisplayname,
    getByUsername: getByUsername,
    addFriend: addFriend,
    removeFriend: removeFriend
};
