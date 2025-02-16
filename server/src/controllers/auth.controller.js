import { ALLOWED_AGE, isAllowedToRegister, SEVEN_DAYS } from "../../../common/date.utils.js";
import { isValidEmail, isValidName, isValidPassword } from "../../../common/regex.js";
import { GENDER } from "../../../common/gender.utils.js";
import User from "../models/user.model.js";
import { blacklistToken, generateAccessToken, generateRefreshToken, revokeRefreshToken, storeRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import { response400 } from "../utils/response.utils.js";
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { firstName, surName, birthDay, gender, email, password } = req.body;

    try{
        if(!firstName || !surName || !birthDay || !gender || !email || !password) { return response400(res, "All fields are required") }
        if(!isValidName(firstName) || !isValidName(surName)) { return response400(res, "First name and surname must be between 3-20 characters long and contain only letters.") }
        
        const parsedBD = new Date(birthDay);
        if (isNaN(parsedBD)) { return response400(res, "Invalid birth date format."); }
        if(!isAllowedToRegister(parsedBD)) { return response400(res, `You must be at least ${ALLOWED_AGE} years old to register.`); }
        if(!Object.keys(GENDER).includes(gender)) { return response400(res, "Invalid gender selection."); }
        if(!isValidEmail(email)) { return response400(res, "Invalid email format."); }
        if(!isValidPassword(password)) { return response400(res, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (._!@#)."); }
      
        const existingEmail = await User.findOne({ email });
        if(existingEmail) { return response400(res, "Email already in use."); }

        const newUser = await User.create({
            firstName : firstName,
            surName : surName,
            birthDay : parsedBD,
            gender : gender,
            email : email,
            password : password,
        })

        return res.status(201).json({
            message : "User registered successfully",
            success : true,
            data : {
                token : "",
                user : {
                    userID : newUser._id,
                    firstName : newUser.firstName,
                    surName : newUser.surName,
                    birthDay : newUser.birthDay,
                    gender : newUser.gender,
                    email : newUser.email,
                }
            }
        });
    }catch(error){
        console.error(error);
        if (error.name === 'ValidationError') {
            return response400(res, error.message);
        }
        res.status(500).json({ message : 'Server error!' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) return response400(res, 'Email and password is required!');
    if(!isValidEmail(email) || !isValidPassword) return response400(res, 'Invalid email or password format!');

    try{
        const user = await User.findOne({ email }).select('+password');
        if(!user) return res.status(401).json({ success : false, message : 'Invalid credentials' });

        const passwordMatch = await user.matchPassword(password);
        if(!passwordMatch) return res.status(401).json({ success : false, message : 'Invalid credentials' });

        const accessToken = generateAccessToken(user._id.toHexString());
        const refreshToken = generateRefreshToken();
        await storeRefreshToken(user._id.toHexString(), refreshToken);

        res.cookie('refreshToken', refreshToken, {
            maxAge : SEVEN_DAYS,
            httpOnly : true,
            secure : true,
            sameSite : 'Strict'
        })
      
        res.status(200).json({
            success: true,
            message : 'Login successful!',
            token: accessToken,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message : 'Server error!',
        });
    }
}

export const logout = async (req, res) => {
    try{
        const accessToken = req.header('Authorization').split(' ')[1];
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) await revokeRefreshToken(refresh);

        const expirationTime = req.user.exp - Math.floor(Date.now() / 1000);
        await blacklistToken(accessToken, expirationTime);
        console.log(req.user);
        res.clearCookie('refreshToken', {
            httpOnly : true,
            secure : true,
            sameSite : 'Strict',
        });
        
        res.status(200).json({ message : "Logged out successfully", success : true });
    }catch(error){
        console.log(error);
        res.status(500).json({ success : false, message : 'Server error!' });
    }
}

export const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(400).json({ success : false, message : 'No refresh token provided.' });

        const userID = await verifyRefreshToken(refreshToken);
        if(!userID) return res.status(401).json({success : false, message : 'Invalid refresh token'});

        const authHeader = req.header('Authorization');
        if(authHeader && authHeader.startsWith('Bearer ')){
            const accessToken = authHeader.split(' ')[1];
            const decodedToken = jwt.decode(accessToken);
            const expirationTime = decodedToken.exp - Math.floor(Date.now() / 1000);
            if(expirationTime > 0) { await blacklistToken(accessToken, expirationTime) }
        }

        const newAccessToken = generateAccessToken(userID);
        const newRefreshToken = generateRefreshToken();

        await Promise.all([
            storeRefreshToken(userID, newRefreshToken),
            revokeRefreshToken(refreshToken)
        ]);

        res.cookie('refreshToken', newRefreshToken, {
            maxAge : SEVEN_DAYS,
            httpOnly : true,
            secure : true,
            sameSite : 'Strict'
        });

        res.status(200).json({ success : true, message : 'Access token is renewed.', token : newAccessToken });
    }catch(error){
        console.log(error);
        res.status(500).json({ success : false, message : 'Server error.' });
    }
}

export const userCredentials = async (req, res) => {
    const user = await User.findById(req.user.userID);
    res.status(200).json({ 
        message : 'me endpoint',
        data : user
    });
}