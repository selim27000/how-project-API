import express from "express";
import { 
  getFeedPosts, 
  getUserPosts, 
  createRating, 
  createComment, 
  updateComment, 
  deleteComment, 
  getPostComments, 
  getPost 
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* POSTS */
router.get("/:id", verifyToken, getFeedPosts);
router.get("/:userId/posts", getUserPosts);
router.get("/post/:postId", getPost);

/* RATINGS */
router.post("/:id/ratings", verifyToken, createRating);

/* COMMENTS */
router.post("/:id/comments", verifyToken, createComment);
router.patch("/:id/comments/:commentId", verifyToken, updateComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);
router.get("/:postId/comments", getPostComments);

export default router;
