import express from 'express';
import { followAndUnfollowUser, 
    loginUser, 
    logOutUser, 
    myProfile, 
    registerUser, 
    userProfile,
    updateUser,
    uploadProfileImage } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';
import multer from "multer";
import uploadFile from "../middleware/multer.js";

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logOutUser);
router.get('/:id',isAuth,userProfile);
router.post('/follow/:id',isAuth,followAndUnfollowUser);
router.put('/update', isAuth, updateUser);
router.post("/profile-image", isAuth, uploadFile, uploadProfileImage);

export default router;