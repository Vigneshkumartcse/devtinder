const express = require('express');
const requestRouter = express.Router();
const userauth = require("../middlewares/auth");
const ConnectionRequestModel = require("../Models/connection");
const UserModel = require("../Models/user");
const mongoose = require('mongoose');
requestRouter.use(express.json());


requestRouter.post("/request/send/:status/:toUserID", userauth, async (req, res) => {
    try {
        const user =req.user;
        const fromUserID = user._id; 
        const toUserID = req.params.toUserID;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];


        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }

        const validId = mongoose.Types.ObjectId.isValid(toUserID) ;
        if(!validId){
            return res.status(400).json({message:"Invalid user id"});
        }
        
        const existingUser =await UserModel.findOne({_id:toUserID});
        if(!existingUser){
            return res.status(400).json({message:"User doen't exist"});
        }
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserID, toUserID },
                { fromUserID: toUserID, toUserID: fromUserID },
            ]
    });
    if (existingRequest) {
        return res.status(400).json({ message: "Request already exists" });
    }

        const request = new ConnectionRequestModel({ 
            fromUserID, 
            toUserID, 
            status
         });
        const result =await request.save();
        res.json({
            message:`${user.firstName} ${status} ${existingUser.firstName}`,
            result
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


requestRouter.post("/request/review/:status/:requestID", userauth, async (req, res) => {
    try {
        const loggedUser = req.user;
        const requestID = req.params.requestID;   
        const status = req.params.status;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
             _id: requestID ,
            toUserID: loggedUser._id,
            status: "interested"
            });
        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection not found" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Request reviewed", data });
        
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
});
    

module.exports = requestRouter;