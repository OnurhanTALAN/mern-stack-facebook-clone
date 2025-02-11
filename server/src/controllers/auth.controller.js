import RefreshToken from "../models/refreshToken.model.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/auth.utils.js";
import { SEVEN_DAYS } from "../utils/date.utils.js";
import { isValidEmail } from "../utils/regex.js";


export const register = async (req, res) => {
    const { email, password } = req.body;
    try{
        const existingEmail = await User.findOne({ email });
        if(existingEmail) { return res.status(400).json({ message : 'Email already in use' }) };

        await User.create({ email, password })

        return res.status(201).json({
            message : "User registered successfully",
            success : true
        });
    }catch(error){
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `${error.message}` });
        }
        res.status(500).json({ message : 'Server error!' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) return res.status(400).json({ message : 'Email and password is required!'});
    if(!isValidEmail(email) || password.length < 6) return res.status(401).json({ success : false, message : 'Invalid email or password format!'})

    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ success : false, message : 'Invalid credentials' });

        const passwordMatch = await user.matchPassword(password);
        if(!passwordMatch) return res.status(401).json({ success : false, message : 'Invalid credentials' });

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge : SEVEN_DAYS,
            httpOnly : true,
            secure : true,
            sameSite : 'Strict'
        })
      
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: accessToken,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error!',
        });
    }
}

export const logout = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;

        if(refreshToken) {
            const deleted = await RefreshToken.deleteOne({ token : refreshToken });
            await User.findByIdAndUpdate(
                deleted.userID,
                { $inc : { tokenVersion : 1} },
            );
        }
            
        res.clearCookie('refreshToken', {
            httpOnly : true,
            secure : true,
            sameSite : 'Strict',
        });
        
        res.status(200).json({ message: "Logged out successfully", success : true });
    }catch(error){
        console.log(error);
        res.status(500).json({ success : false, message : 'Server error!' });
    }
}

export const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(400).json({ success : false, message : 'No refresh token provided.' });

        const tokenDoc = await RefreshToken.findOne({ token : refreshToken });
        if(!tokenDoc) return res.status(403).json({ success : false, message : 'Invalid refresh token.' });
        
        const decodedUser = await verifyToken(refreshToken, 'REFRESH');
        const newAccessToken = await generateAccessToken(decodedUser.userID);
        res.status(200).json({ success : true, message : 'Access token is renewed.', token : newAccessToken });
    }catch(error){
        console.log(error);
        res.status(500).json({ success : false, message : 'Server error.' });
    }
}

export const userCredentials = (req, res) => {
    const user = req.user
    res.status(200).json({ 
        message : 'me endpoint',
        data : {
            email : user.email,
            
        }
    });
}