import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

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

        res.status(200).json({succes: true, msg: 'User register succesfully'});
    }
    catch(error){
        res.status(500).json({succes: false, msg: 'Server error'});
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
                res.status(200).send({succes: true, token});
            }
        }

        res.status(400).json({succes: false, msg: 'Invalid email or password'});
    }
    catch(error){
        res.status(500).json({succes: false, msg: 'Server error'});
    }
}