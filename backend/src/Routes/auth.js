
const express = require("express");
const UserModel = require("../Models/user");
const authRouter = express.Router();
const {signupvalidate}= require("../utils/validate");
const bcrypt = require("bcrypt");
const userauth = require("../middlewares/auth");
authRouter.use(express.json());


authRouter.post("/signup", async (req, res) => {

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

authRouter.post("/login", async (req, res) => {
    

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email:email
        });
        
        if (!user) {
            throw new Error("Invalid login credentials");  
        }
        const isMatch = await user.isValidatepassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

                // Generate a token (replace this with a real JWT token)
                const token = await user.getjwt();

                //  Set secure cookie
                res.cookie("token", token);
        
                return res.status(200).json({ message: "User logged in successfully" });
        
    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

authRouter.post("/logout",userauth,async(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"User logged out successfully"});
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });  
    }
})

module.exports = authRouter;