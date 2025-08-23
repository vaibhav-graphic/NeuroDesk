import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Chat from "../models/Chat.js";


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({ success: false, msg: "User already exists" }); 
        }

        const user = await User.create({name, email, password});

        return res.status(200).json({succes: true, msg: 'User register succesfully'});
    }
    catch(error){
        return res.status(500).json({succes: false, msg: 'Server error'});
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(user){
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch){
                const token = generateToken(user._id);
                return res.status(200).send({succes: true, token});
            }
        }

        return res.status(400).json({succes: false, msg: 'Invalid email or password'});
    }
    catch(error){
        return res.status(500).json({succes: false, msg: 'Server error'});
    }
}

export const getUser = async (req, res) => {
    try{
        const user = req.user;
        return res.status(200).json({succes: true, user});
    }
    catch(error){
        return res.status(500).json({succes: false, msg: 'Server error'});
    }
}

export const getPublishedImage = async (req, res) => {
    try{
        const publishedImageMessages = await Chat.aggregate([
            {$unwind: "$message"},
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ]);

        res.status(200).json({success: true, images: publishedImageMessages});
    }
    catch(error){
        res.status(400).json({success: false, msg: error.message});
    }
}