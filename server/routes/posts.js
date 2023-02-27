import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // get all posts
router.get("/:userId/posts", verifyToken, getUserPosts); // get posts from user

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;