import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try{
        const { id } = req.params; // get id from req body
        const user = await User.findById(id); // use id to find user in mongodb
        res.status(200).json(user); // send everyth relevant back to frontend

    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // get all friends
        );

        const formattedFriends = friends.map(
            ({_id, username, occupation, location, picturePath}) => {
                return {_id, username, occupation, location, picturePath};
            }
        )
    
        res.status(200).json(formattedFriends);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try{
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId); // filter function copies array based on conditions
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save(); // make sure save updated list

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // get all friends
        );

        const formattedFriends = friends.map(
            ({_id, username, occupation, location, picturePath}) => {
                return {_id, username, occupation, location, picturePath};
            }
        )

        res.status(200).json(formattedFriends);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}