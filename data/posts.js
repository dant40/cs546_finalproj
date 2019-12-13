const mongoCollections = require("../config/collections.js");
const posts = mongoCollections.posts;
const ObjectID = require('mongodb').ObjectID;
const users = require("./users");


//Contains following:
// create post, delete post, get all posts, get one post, like post by id,
//comment on post by id

//author is just the corresponding user_id
//content is self-explanatory
async function create(author,content){
    if(author == undefined || location == undefined || content == undefined)
        throw new Error ("Error, must specify user and post content")
    //not enforcing anything about the types of these, assume they are used right
    var col = await posts()
   
    var temp = {
        _id: ObjectID.generate(),
        date: new Date(),
        author: author,
        conent: content,
        likes: {
            amount: 0,
           // likedBy: []
        },
        comments: []
    }

    const insertInfo = await col.insertOne(temp);
    if (insertInfo.insertedCount === 0) 
        throw new Error ("Could not create post");
    return temp 
}

async function getAll(){
    var col = await posts();
    var cur = await col.find();
    return cur.toArray();
}

async function get(id){

    if(id === undefined)
        throw new Error ("Please enter an id")
    var col = await posts();
    var temp = await col.findOne({_id: ObjectID(id)})
    if(temp === null)
        throw new Error ("No posts found")

    return temp;
}

//THIS SHOULD ALWAYS BE CALLED WITH deletePostFromUser
async function remove(id){

    if(id === undefined)
        throw new Error ( "Please enter an id")
    
    var col = await posts();
    var temp = await this.get(id)
    const deletionInfo = await col.removeOne(temp);

    if (deletionInfo.deletedCount === 0) {
        throw new Error (`Could not delete post with id of ${id}`);
    }
    var result = {
        deleted: true,
        data: temp
    }
    return result
}

//This doesn't handle keeping a list of the users who've liked this yet 
async function likePostById(id){
    if(id === undefined )
    throw new Error ("Please enter id")

    // if(typeof(id)!== 'string')
    //     throw new Error ("Invalid input type!")

    var col = await posts();
    
    const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$inc : {"likes.amount": 1 }});
        if (updateInfo.modifiedCount === 0) {
          throw new Error ( "Could not perform post addition successfully");
        }
    
   const res  = await this.get(id); 
   try {
       await users.updatePostById(res.author,res)
    }catch(e) { throw new Error ("Warning: Post update not reflected in user")}
   return res
}
//Does not enforce comment format
//Expected to have: _id, date,author(user_id), content 
//Liking comments NYI
async function commentOnPostById(id,comment){
    if(id === undefined || comment === undefined )
    throw new Error ("Please enter id")

    var col = await posts();
    
    const updateInfo = await col.updateOne({ _id: ObjectID(id) }, {$push : {"comments": comment }});
        if (updateInfo.modifiedCount === 0) {
          throw new Error ( "Could not perform post addition successfully");
        }
    
   const res  = await this.get(id); 
   try {
       await users.updatePostById(res.author,res)
    }catch(e) { throw new Error ("Warning: Post update not reflected in user")}
   return res
}


module.exports = {
    create: create,
    remove: remove,
    getAll: getAll,
    get: get,
    likePostById: likePostById,
    commentOnPostById: commentOnPostById
}