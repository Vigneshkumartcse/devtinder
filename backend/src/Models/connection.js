const mongoose = require('mongoose');
const validator = require('validator');
const UserModel = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
       
    },
    toUserID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        enum: {
            values:["ignored","interested","accepted","rejected"],
            message: "{VALUE} is not supported"
        },

    }
},
{
    timestamps: true,
}
);


connectionRequestSchema.index({fromUserID:1,toUserID:1});


connectionRequestSchema.pre("save", async function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
        throw new Error("You can't send request to yourself");
    }
   
next();
});


const ConnectionRequestModel = mongoose.model("Connection", connectionRequestSchema);

module.exports = ConnectionRequestModel;