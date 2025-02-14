
const express = require("express");
const UserModel = require("../Models/user");
const router = express.Router();
const signupvalidate = require("../utils/validate");
const bcrypt = require("bcrypt");
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

        
        
            throw new Error("Invalid login credentials");
        }else{
                //cookiee
            res.cookie("token","qwertyujkhgfertyjhgnfbrgthrgbfv");
            res.status(200).json({ message: "User logged in successfully" });   
        }
    } catch (error) {

        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/profile",async(req,res)=>{
    const cookies=req.cookies;
    console.log(cookies);
    res.send("cookies")
})


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