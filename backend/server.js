const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectToMongoDB } = require("./config/db");

// routes import
const jobRoutes = require('./routes/jobs');
const workerRoutes = require('./routes/worker');

dotenv.config();
const PORT = process.env.PORT

const app = express();

app.use(cors());

// middlewares
app.use(express.json());

// routes
app.use('/api/jobs', jobRoutes);
app.use('/api/workers', workerRoutes);

app.get('/', (req, res) => {
    res.send("Backend is Running!")
});

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
});