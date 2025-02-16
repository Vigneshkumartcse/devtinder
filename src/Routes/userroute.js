
const express = require("express");
const UserModel = require("../Models/user");
const router = express.Router();
const signupvalidate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.use(express.json());



router.post("/signup", async (req, res) => {

    try {
        signupvalidate(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await newUser.save();
        
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email
        });
        
        if (!user) {
            throw new Error("Invalid login credentials");  
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

                // Generate a token (replace this with a real JWT token)
                const token = await jwt.sign({_id : user._id},"Kumar@2002");

                //  Set secure cookie
                res.cookie("token", token);
        
                return res.status(200).json({ message: "User logged in successfully" });
        
    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/profile", async (req, res) => {
    try {
        const cookies=req.cookies;
    const {token}=cookies;
    if(!token){
        throw new Error("Invalid token");
    }
    const decoded=jwt.verify(token,"Kumar@2002");
    const { _id } = decoded;
    if(!_id){
        throw new Error("Invalid token");
    }
    const user = await UserModel.findById(_id);
        if (!user) {
            throw new Error("User not found");  
        }
        console.log(user);
        res.status(200).json(user);
            
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
    
});



router.delete("/users", async (req, res) => {
    try {
        // const userId = req.params.id; 
        const  userId  = req.body.userid;
        const user = await UserModel.findByIdAndDelete(userId); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
);

router.patch("/users/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {

        const allow =[ "age","skills","photoUrl","bio","gender"];
        const updates = Object.keys(data).every((update) => allow.includes(update));
        if (!updates) {
           throw new Error("Invalid updates");
        }
        if (data.skills?.length > 20) {
           throw new Error("skills must be less than 5");
        }
        const user = await UserModel.findByIdAndUpdate(userId, data, { runValidators: true });
        
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;