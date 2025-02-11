import RefreshToken from "../models/refreshToken.model.js";
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';
import { SEVEN_DAYS } from "./date.utils.js";


export const generateAccessToken = async (userID) => {
    const user = await User.findByIdAndUpdate(
        userID,
        { $inc : { tokenVersion : 1 } },
        { new : true}
    );
    return jwt.sign(
        {
            userID: user._id,
            email: user.email,
            role: user.role,
            tokenVersion : user.tokenVersion,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn : '15m'}
    );
}

export const generateRefreshToken = async (userID) => {
    await RefreshToken.deleteMany({ userID : userID});

    const user = await User.findById(userID);
    const refreshToken = jwt.sign(
        {
            userID: user._id,
            email: user.email,
            role: user.role,
            tokenVersion : user.tokenVersion,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn : '7d'}
    );
    await RefreshToken.create({
        token : refreshToken,
        userID : userID,
        expiresAt : new Date(Date.now() + SEVEN_DAYS)
    });
    return refreshToken;
}

export const verifyToken = (token, secretType = 'ACCESS') => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretType === 'ACCESS' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            err ? reject(err) : resolve(decoded)
        })
    });
}