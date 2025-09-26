
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database successfully connected');
    } catch (error) {
        console.log("Error connecting to the Database", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
