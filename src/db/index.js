import mongoose from "mongoose";    // Import mongoose for MongoDB object modeling
import { DB_NAME } from "../constants.js";  // Import the database name constant

const connectDB = async () => { 
    try {   
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // Connect to MongoDB using the URI from environment variables and the database name
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);  // Log the successful connection message with the host information
        
    } catch (error) {   
        console.log("mongoDb connection error", error); // Log the error message if the connection fails
        process.exit(1) // Exit the process with a failure code
        
    }
}

export default connectDB    // Export the connectDB function for use in other modules