import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const credentialRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const restrictedUsernames = ['admin', 'root', 'test', 'user', 'guest'];


const UserSchema = new mongoose.Schema({
  // username : {
  //   type : String,
  //   required : [true, 'Username is required'],
  //   unique : true,
  //   trim : true,
  //   minLength : [6, 'Username must be at least 6 characters long'],
  //   maxLength : [20, 'Username can be at most 20 characters long'],
  //   match: [/^\S*$/, 'Username cannot contain spaces'],
  //   validate : [
  //     {
  //       validator : (value) => { return credentialRegex.test(value); },
  //       message : 'Username must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  //     },
  //     {
  //       validator: (value) => !restrictedUsernames.includes(value.toLowerCase()),
  //       message: 'This username is not allowed. Please choose a different one.',
  //     },  
  //   ] 
  // },
  email: { 
    type: String,
    required: true,
    unique: true,
    trim : true,
    validate : {
      validator : (value) => { return emailRegex.test(value); },
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
        validator : (value) => { return credentialRegex.test(value); },
        message : 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
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
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { return next(); }
    try {
      const salt = await bcrypt.genSalt(10);
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
