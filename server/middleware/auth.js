import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try{
        let token = req.header("Authorisation"); // from req from front end, grab authorisation header, set token

        if(!token) {
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft(); // take everything after Bearer from front end
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // for middleware, use to next fn to proceed to next step of function
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
} 