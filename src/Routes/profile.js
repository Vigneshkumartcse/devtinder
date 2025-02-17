const express = require('express');
const profileRouter = express.Router();
const userauth = require("../middlewares/auth");
const {isUpdateValid} = require("../utils/validate");
const bcrypt = require("bcrypt");
profileRouter.use(express.json());


profileRouter.get("/profile/view", userauth , async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
            
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
    
});

profileRouter.patch("/profile/edit", userauth , async (req, res) => {
    try {
        
        isUpdateValid(req);
        const loggedUser = req.user;
        Object.keys(req.body).forEach((update)=> loggedUser[update] = req.body[update]);
        await loggedUser.save();
        res.status(200).json({message: `${loggedUser.firstName } User details updated successfully`, data: loggedUser});
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
});

profileRouter.patch("/profile/edit/password", userauth, async (req, res) => {
    try {
        const user = req.user;

        const { oldPassword, password: newPassword } = req.body;

        // Validate old password
        const isMatch = await user.isValidatepassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "User password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = profileRouter;