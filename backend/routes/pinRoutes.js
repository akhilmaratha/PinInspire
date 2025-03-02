import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import {
  commentOnPin,
  createPin,
  deleteComment,
  deletePin,
  getAllPins,
  getSinglePin,
  updatePin,
} from "../controllers/pinController.js";
import mongoose from "mongoose";
import { Pin } from "../models/pinModel.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile, createPin);
router.get("/all", isAuth, getAllPins);
router.get("/:id", isAuth, getSinglePin);
router.put("/:id", isAuth, updatePin);
router.delete("/:id", isAuth, deletePin);
router.post("/comment/:id", isAuth, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    const newComment = {
      _id: new mongoose.Types.ObjectId(),  // Generate new ID
      user: req.user._id,                  // User ID from auth middleware
      name: req.user.name,                 // User name
      avatar: req.user.avatar,             // User avatar
      comment: req.body.comment            // Comment text
    };

    pin.comments.unshift(newComment);      // Add to start of comments array
    await pin.save();

    res.json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
