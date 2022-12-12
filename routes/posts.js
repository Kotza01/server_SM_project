import express from "express";

const Routes = express.Router();
import { auth } from "../middleware/auth.js";

import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likeToPost,
  getBySearch,
  getOnePosts,
  commentToPost,
} from "../controllers/posts.js";

Routes.get("/", getAllPosts);
Routes.get("/search", getBySearch);
Routes.get("/:id", getOnePosts);

Routes.post("/", auth, createPost);
Routes.patch("/:id", auth, updatePost);
Routes.delete("/:id", auth, deletePost);
Routes.patch("/:id/likePost", auth, likeToPost);
Routes.patch("/:id/comment", auth, commentToPost);

export default Routes;
