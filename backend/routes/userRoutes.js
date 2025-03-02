import express from 'express';
import { followAndUnfollowUser, 
    loginUser, 
    logOutUser, 
    myProfile, 
    registerUser, 
    userProfile,
    updateUser } from '../controllers/userController.js';
import { isAuth } from '../middleware/isAuth.js';

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logOutUser);
router.get('/:id',isAuth,userProfile);
router.post('/follow/:id',isAuth,followAndUnfollowUser);
router.put('/update', isAuth, updateUser);



export default router;