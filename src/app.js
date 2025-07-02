import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({      // Enable CORS for all origins
    origin: process.env.CORS_ORIGIN,    // Set the allowed origin from environment variable
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.) to be sent
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

}))

app.use(express.json({limit: "16kb"}))  // Parse JSON bodies with a limit of 16kb
app.use(express.urlencoded({extended: true, limit: "16kb"}))    // Parse URL-encoded bodies with a limit of 16kb
app.use(express.static("public"))   // Serve static files from the "public" directory
app.use(cookieParser()) // Parse cookies from incoming requests 
app.use(express.json()); // for application/json    
app.use(express.urlencoded({ extended: true })); // for form submissions    


//import routes
import userRouter from './routes/user.routes.js'    //  Import user routes

// routes declartion
app.use("/api/v1/users", userRouter)    // Use user routes for the "/api/v1/users" path

export { app }