const mongoose = require("mongoose");
const { connectDatabase } = require("./src/config/db");
const postService = require("./src/services/postService");
const User = require("./src/models/User");

const run = async () => {
  await connectDatabase();
  console.log("Checking posts...");
  const admin = await User.findOne({ email: "admin@enterprise.local" });
  try {
    const posts = await postService.listPosts(admin);
    console.log("Posts fetched successfully! Count:", posts.length);
  } catch (err) {
    console.error("List posts failed:", err.message);
  }
  process.exit(0);
};

run().catch(console.error);
