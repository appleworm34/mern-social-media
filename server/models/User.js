import mongoose from "mongoose";

// when creating a model, create userschema first
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    picture: {
        type: String,
        default: ""
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number
},
    { timestamps: true }
);

// then pass it into mongoose.model
const User = mongoose.model("User", UserSchema);

export default User;