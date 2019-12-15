const dbConnection = require("./connection.js");

const users = require("../data/users");
const posts = require("../data/posts");

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const user1 = await users.create("testUser1","tim" ,"pass");
  const id = user1._id
  const user2 = await users.create("testUser2","leonard" ,"pass2")
  const post1 =await posts.create(id,"Hello Everyone");
 
  //EVERY TIME A POST IS MADE, THIS SHOULD BE DONE
  const temp = await users.addPostToUser(id,post1) 

  const temp2 =await posts.likePostById(post1._id,user2.username)
  const temp3 = await users.updatePostById(id,temp2)
  //Just using a simple text comment here, actual comments passed in
  //should have a username at least
  const temp4 = await posts.commentOnPostById(post1._id, "This is lame")
  const temp5 = await users.updatePostById(id,temp4)
 
  const result1 = await users.get(user1._id)
  const result2 = await posts.getAll()
 console.log(result1)
 console.log(result2)
  // console.log(temp4)
  console.log("Done seeding database");
  await db.close();
}

main();