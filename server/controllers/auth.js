import bcrypt from "bcrypt"; // allow us to encrypt password
import jwt from "jsonwebtoken"; // give way to send user web token to use for authorisation
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { // async as need to call mongodb
    try{
        const { // structure parameters from req body
            username,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt(); // create random salt to encrypt password
        const passwordHash = await bcrypt.hash(password, salt); 

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // if no error, send status 201 -> means object successfully created

    } catch(err) {
        res.status(500).json({ error: err.message }); // status 500 -> error on user side
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); // using mongoose to find the one that matches email
        if(!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password; // delete password so it doesnt get sent to front end
        res.status(200).json({ token, user}); // send token and user

    } catch(err) {
        res.status(500).json({ error: err.message }); 
    }
}