import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import crypto from 'crypto';
import { SEVEN_DAYS } from "../../../common/date.utils.js";

export const generateAccessToken = (userID) => {
  return jwt.sign(
    { userID },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return refreshToken;
}

export const storeRefreshToken = async (userID, refreshToken) => {
  const key = `refresh_${refreshToken}`;
  await redis.set(key, userID, 'EX', SEVEN_DAYS / 1000);
}

export const verifyRefreshToken = async (refreshToken) => {
  const key = `refresh_${refreshToken}`;
  const userId = await redis.get(key);
  return userId;
}

export const revokeRefreshToken = async (refreshToken) => {
  const key = `refresh_${refreshToken}`;
  await redis.del(key);
}

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
      (err, decoded) => {
        err ? reject(err) : resolve(decoded);
      }
    );
  });
}

export const blacklistToken = async (token, expirationTime) => {
  try{
    await redis.set(`bl_${token}`, 'true', 'EX', expirationTime);
    return true;
  }catch(error){
    console.log('Error blacklisting token : ', error);
    return false;
  }
}

export const isTokenBlackListed = async (token) => {
  try{
    return await redis.get(`bl_${token}`);
  }catch(error){
    console.log('Error checking blacklisted token : ', error);
    return true;
  }
}