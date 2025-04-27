import { Pin } from "../models/pinModel.js";
import getDataUri from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import { User } from "../models/userModel.js";

export const createPin = async (req, res) => {
  try {
    const { title, pin } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        message: "Please upload an image"
      });
    }

    const fileUri = getDataUri(file);
    
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "pinterest",
      resource_type: "auto"
    });

    await Pin.create({
      title,
      pin,
      image: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Pin Created Successfully"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAllPins = async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });
    res.json(pins);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSinglePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id).populate("owner", "-password");
    res.json(pin);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const commentOnPin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });

    pin.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });

    await pin.save();

    res.json({
      message: "Comment Added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });

    if (!req.query.commentId)
      return res.status(404).json({
        message: "Please give comment id",
      });

    const commentIndex = pin.comments.findIndex(
      (item) => item._id.toString() === req.query.commentId.toString()
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const comment = pin.comments[commentIndex];

    if (comment.user.toString() === req.user._id.toString()) {
      pin.comments.splice(commentIndex, 1);
      await pin.save();
      return res.json({
        message: "Comment Deleted",
      });
    } else {
      return res.status(403).json({
        message: "You are not owner of this comment",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deletePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });

    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await cloudinary.v2.uploader.destroy(pin.image.id);
    await pin.deleteOne();

    res.json({
      message: "Pin Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updatePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });

    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    pin.title = req.body.title;
    pin.pin = req.body.pin;

    await pin.save();

    res.json({
      message: "Pin updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Save or Unsave a Pin
export const saveOrUnsavePin = async (req, res) => {
  try {
    const userId = req.user._id;
    const pinId = req.params.id;
    // if (!mongoose.Types.ObjectId.isValid(pinId)) {
    //   return res.status(400).json({ message: "Invalid pin ID" });
    // }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const alreadySaved = user.savedPins.includes(pinId);
    if (alreadySaved) {
      user.savedPins = user.savedPins.filter(id => id.toString() !== pinId);
      await user.save();
      return res.json({ message: 'Pin unsaved', saved: false });
    } else {
      user.savedPins.push(pinId);
      await user.save();
      return res.json({ message: 'Pin saved', saved: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all saved pins for user
export const getSavedPins = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);
    const user = await User.findById(userId).populate({
      path: 'savedPins',
      populate: { path: 'owner', select: '-password' }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedPins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
