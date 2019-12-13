const dbConnection = require("./connection.js");
const data = require("../data/");
const users = data.users;
const posts = data.posts;

async function main() {
  const db = await dbConnection();
  //await db.dropDatabase();

  const user1 = await users.create("testUser1", "pass");
  const id = user1._id;
  const post1 =await posts.create(id,"Hello Everyone");
  //EVERY TIME A POST IS MADE, THIS SHOULD BE DONE
  const temp = await users.addPostToUser(id,post1)  
  await posts.likePostById(post1._id)
  console.log(temp)
  console.log("Done seeding database");
  await db.close();
}

main();