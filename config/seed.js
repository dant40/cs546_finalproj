const dbConnection = require("./connection.js");
const data = require("../data/");
const users = data.users;
const posts = data.posts;

async function main() {
  const db = await dbConnection();
  //await db.dropDatabase();

  const user1 = await users.create("testUser1", "pass");
  const id = user1._id;
  //await posts.addPost();
    

  console.log("Done seeding database");
  await db.close();
}

main();