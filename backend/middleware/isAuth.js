import  jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";
export const isAuth=async(req,res,next) => {
    try {
        const token=req.cookies;
        if(!token){
            return res.status(401).json({error:"You are not authenticated"})
        }

        const decodedData=jwt.verify(token,process.env.SECRET_KEY)
        if(!decodedData){
            return res.status(403).json({error:"token expired"})
        }
        req.user=await User.findById(decodedData.id);
        next();
    } catch (error) {
        res.status(500).json({message:"please login first"})
    }
}