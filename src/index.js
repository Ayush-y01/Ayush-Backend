// require('dotenv').config({path: './env'})


// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";


import dotenv from "dotenv";    // Import dotenv to manage environment variables
// import cors from "cors";    // Import CORS middleware for handling cross-origin requests
import connectDB from "./db/index.js";  // Import the database connection function
import { app } from './app.js'  // Import the Express app

dotenv.config({   // Load environment variables from a .env file    
    path: './.env'      // Specify the path to the .env file
})

connectDB() // Connect to the database
// mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // Connect to MongoDB using the URI from environment variables and the database name

.then(() => {   // Once the database connection is successful
    // console.log("Mongo DB connection Successful !!!!");
    app.listen(process.env.PORT || 8000, () => {    // Start the Express server on the specified port
        console.log(`Server is running at port : ${process.env.PORT}`); // Log the port on which the server is running
        
    })
})
.catch((err => {    // If there is an error connecting to the database
    console.log("Mongo DB connection Failed !!!!", err);    // Log the error message
    // process.exit(1)  // Exit the process with a failure code    
    
}))






















/*
import express from "express"
const app = express()

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log("ERROR: ", error);
            throw error
            
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("ERROR: " ,error);
        throw err
        
    }
})()
function connectDB(){

}

connectDB()
*/