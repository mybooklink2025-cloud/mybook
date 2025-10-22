// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
