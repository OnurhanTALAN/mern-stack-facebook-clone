import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true,
    },
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    expiresAt : {
        type : Date,
        required : true,
        index : { expires : 0}
    }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;