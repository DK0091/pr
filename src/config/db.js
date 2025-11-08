import mongoose from "mongoose";

async function connectdb() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("ERROR OCCURRED WHILE CONNECTING DB:", error.message);
        process.exit(1);
    }
}

export default connectdb;
