const express = require('express');
const connectdb = require("./config/database");
const router = require("./Routes/userroute");

const app = express();


app.use(express.json());

app.use("/devtinder", router);


connectdb().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch((err) => console.error("Database connection error:", err));
