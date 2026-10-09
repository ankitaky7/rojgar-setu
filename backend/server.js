const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {connectToMongoDB} = require("./config/db");

dotenv.config();
const PORT = process.env.PORT

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send("Backend is Running!")
});

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});