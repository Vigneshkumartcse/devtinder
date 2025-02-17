const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user"); 

const userauth = async (req, res, next) => {
    try {
        
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

       
        const decoded = await jwt.verify(token, "Kumar@2002"); 
        
        const { _id } = decoded;
        if (!_id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        
        const user = await UserModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; 
        next(); 

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = userauth;
