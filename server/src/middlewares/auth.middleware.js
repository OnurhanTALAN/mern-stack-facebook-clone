import User from "../models/user.model.js";
import { verifyToken } from "../utils/auth.utils.js";

export const authorizeToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader.startsWith('Bearer ')) return res.status(401).json({ message : 'No token provided.'});
    const providedToken = authHeader.split(' ')[1];
    try{
        const decodedUser = await verifyToken(providedToken);
        const user = await User.findById(decodedUser.userID).select('-password');
        if(decodedUser.tokenVersion !== user.tokenVersion) { return res.status(403).json({ message : 'Old access token.' })}
        req.user = user;
        next();
    }catch(error){
        res.status(400).json({ message : 'Invalid token' });
    }
}