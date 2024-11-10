import express from 'express';
import dotenv from "dotenv";
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import path from "path";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
  
});

const app = express();

const port=process.env.PORT || 4000;

// middleware

app.use(express.json());
app.use(cookieParser());



//importing routes 
import userRoutes from './routes/userRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
//using routes
app.use("/api/user",userRoutes)
app.use("/api/pin",pinRoutes)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    connectDB();
});
