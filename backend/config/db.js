const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb Connected Successfully!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = {
    connectToMongoDB
}