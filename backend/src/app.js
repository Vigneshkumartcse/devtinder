const express = require('express');
const connectdb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");


app.use("/devtinder", authRouter);
app.use("/devtinder", profileRouter);
app.use("/devtinder", requestRouter);
app.use("/devtinder", userRouter);


connectdb().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch((err) => console.error("Database connection error:", err));
