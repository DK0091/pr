import mongoose from "mongoose";

async function connectdb() {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/E_COMMERCE`)
        console.log(`Database connected:${connection.connection.host}`)
    } catch (error) {
        console.log("ERROR OCCUERED WHILE CONNECTING DB")
        process.exit(1)
    }
};


export default connectdb;