import { verifyAccessToken, isTokenBlackListed } from "../utils/auth.utils.js";

export const authenticateToken = async (req, res, next) => {
    try{
        const authHeader = req.header('Authorization');
        if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message : 'No token provided.'});

        const providedToken = authHeader.split(' ')[1];
        
        const isBlackListed = await isTokenBlackListed(providedToken);
        if(isBlackListed) { return res.status(401).json({ success : false, message : 'Token has been invalidated.' })}

        const decodedUser = await verifyAccessToken(providedToken);
        req.user = decodedUser;
        next();
    }catch(error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Token verification error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}