const dbConnection = require("./connection.js");

const users = require("../data/users");
const posts = require("../data/posts");

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const user1 = await users.create("testUser1", "pass");
  const id = user1._id;
  const post1 =await posts.create(id,"Hello Everyone");
 
  //EVERY TIME A POST IS MADE, THIS SHOULD BE DONE
  const temp = await users.addPostToUser(id,post1)  
  const temp2 =await posts.likePostById(post1._id)
  const temp3 = await users.updatePostById(id,temp2)
  // const temp4 = await posts.get(post1_id)
  console.log(temp3)
  // console.log(temp4)
  console.log("Done seeding database");
  await db.close();
}

main();