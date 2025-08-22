import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if(user){
            res.status(401).json({succes: false, msg: 'Not authorized, user not found'});
        }

        req.user = user;
        next();
    }
    catch(error){
        res.status(401).json({succes: false, msg: 'Not authorized, token failed'});
    }
}