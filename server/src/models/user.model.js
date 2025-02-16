import mongoose, { get } from "mongoose";
import bcrypt from "bcryptjs";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../../../common/regex.js";
import { ALLOWED_AGE, isAllowedToRegister } from "../../../common/date.utils.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      validate: {
        validator: isValidName,
        message:
          "First name must be between 3-20 characters long and must only contain letters.",
      },
    },
    surName: {
      type: String,
      required: [true, "Surname is required"],
      trim: true,
      validate: {
        validator: isValidName,
        message:
          "Surname must be between 3-20 characters long and must only contain letters.",
      },
    },
    birthDay : {
      type : Date,
      required : [true, "Birth date is required"],
      validate : {
        validator : isAllowedToRegister,
        message : `You must be at least ${ALLOWED_AGE} years old to register.`
      },
      get : (date) => date.toISOString().split("T")[0],
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: [true, "Gender is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: "Invalid email format",
      },
      index: { unique: true },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      trim: true,
      minLength: [6, "Password must be at least 6 characters long"],
      maxLength: [20, "Password can be at most 20 characters long"],
      match: [/^\S*$/, "Password cannot contain spaces"],
      validate: {
        validator: isValidPassword,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (._!@#)",
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    return next(new Error("Error hashing password"));
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);
export default User;
