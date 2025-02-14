const mongoose = require('mongoose');


// Database Connection
const connectdb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/devtinder');
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        
    }
};

module.exports = connectdb;
