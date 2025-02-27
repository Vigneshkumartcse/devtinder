const express = require('express');
const userRouter = express.Router();
const  ConnectionRequestModel = require("../Models/connection");
const userauth = require("../middlewares/auth");
const UserModel = require("../Models/user");
userRouter.use(express.json());




userRouter.get("/user/connection/received", userauth ,async (req, res) => {
    try {
        const loggedUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({toUserID:loggedUser._id,status:"interested"}).populate("fromUserID",[ "firstName", "lastName","photoUrl","bio","skills"]);
        
        res.status(200).json({
            message: `Received connection requests from   `,
            data: connectionRequest
        });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
   
});

userRouter.get("/user/connection", userauth ,async (req, res) => {
    try {
        const loggedUser = req.user;
       const connectionRequest = await ConnectionRequestModel.find({
            $or: [{ toUserID: loggedUser._id,status:"accepted" }, { fromUserID: loggedUser._id ,status:"accepted"}],
            
        }).populate("fromUserID", ["firstName", "lastName","photoUrl","bio","skills"]).populate("toUserID", ["firstName", "lastName","photoUrl","bio","skills"]);

        const data = connectionRequest.map((item) => {
            if(item.fromUserID._id.toString() === loggedUser._id.toString()){
                return item.toUserID
            }else{
                return item.fromUserID
            }
        });
        
        res.status(200).json({
            message: `All connections of user`,
            data: data
        });
        
       
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
});


userRouter.get("/feed", userauth ,async (req, res) => {
    try {
        const loggedUser = req.user;
        const page =parseInt(req.query.page )|| 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connection= await ConnectionRequestModel.find({
            $or: [{ toUserID: loggedUser._id}, { fromUserID: loggedUser._id}]
        });
        const hideUser = new Set();
        connection.forEach((item) => {
            hideUser.add(item.fromUserID.toString());
            hideUser.add(item.toUserID.toString());
        });

        const feed = await UserModel.find({
          $and: [ { _id: { $nin: Array.from(hideUser) } }, { _id: { $ne: loggedUser._id } }],
         }).select(["firstName", "lastName","photoUrl","bio"]).skip(skip).limit(limit);


       
        res.status(200).json({
            message: `All feeds of user`,
            data: feed
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    } });

module.exports = userRouter;