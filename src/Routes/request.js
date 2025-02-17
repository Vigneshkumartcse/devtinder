const express = require('express');
const requestRouter = express.Router();
const userauth = require("../middlewares/auth");
requestRouter.use(express.json());

requestRouter.post("/sendConnectionRequest", userauth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user.firstName +" send a connection request");
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });   
}});

module.exports = requestRouter;