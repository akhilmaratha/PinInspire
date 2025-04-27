import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    savedPins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin',
        default: []
    }],
},{timestamps:true})

export const User= mongoose.model("User", userSchema);