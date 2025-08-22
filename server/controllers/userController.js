import jwt from "jsonwebtoken"

import User from "../models/User.js";


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

        const token = generateToken(user._id);
        res.status(200).json({succes: true, token});
    }
    catch(error){
        res.status(500).json({succes: false, msg: 'Server error'});
    }
}