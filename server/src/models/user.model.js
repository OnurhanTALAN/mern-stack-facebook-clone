import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isValidEmail, isValidName, isValidPassword } from '../../../common/regex.js';

const UserSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required : true,
    trim : true,
    validate : [
      {
        validator : (value) => { return isValidName(value) },
        message : 'First name must be between 3-20 characters long and must only contain letters.'
      },
    ]
  },
  surName : {
    type : String,
    required : true,
    trim : true,
    validate : [
      {
        validator : (value) => { return isValidName(value) },
        message : 'Surname must be between 3-20 characters long and must only contain letters.'
      },
    ]
  },
  gender : {
    type : String,
    enum : ['MALE', 'FEMALE', 'OTHER'],
    required : true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    trim : true,
    validate : {
      validator : (value) => { return isValidEmail(value) },
      message : 'Non valid email!'
    }
  },
  password: {
    type : String,
    required : true,
    trim : true,
    minLength : [6, 'Password must be at least 6 characters long'],
    maxLength : [20, 'Password can be at most 20 characters long'],
    match: [/^\S*$/, 'Password cannot contain spaces'],
    validate : {
        validator : (value) => { return isValidPassword(value) },
        message : 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (._!@#)',
      }
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  posts : {
    type : [mongoose.Schema.Types.ObjectId],
    ref : 'Post',
    default : []
  },
  tokenVersion : {
    type : Number,
    default : 0,
  }
},{timestamps : true});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { return next(); }
    try {
      const salt = await bcrypt.genSalt(process.env.BCRYPT_SALT_ROUNDS || 10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
