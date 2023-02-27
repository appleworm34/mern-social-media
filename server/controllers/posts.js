import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try{
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            username: user.username,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })

        await newPost.save(); // save the post
        
        const post = await Post.find(); // grab updated list of all the posts

        res.status(201).json(post); // send list back to front end
    } catch(err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try{
        const post = await Post.find(); // grab updated list of all the posts

        res.status(200).json(post); // send list back to front end
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async(req, res) => {
    try{
        const { userId } = req.params;

        const post = await Post.find({ userId }); // grab updated list of all the posts by a certain user

        res.status(200).json(post); // send list back to front end
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try{
        const { id } = req.params; // post id comes from query string
        const { userId } = req.body; // user id comes from the req body
        const post = await Post.findById(id); // get post information
        const isLiked = post.likes.get(userId); // check if userId is in likes map

        if(isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate( // find then update the post
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost); // send updated post to front end
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}