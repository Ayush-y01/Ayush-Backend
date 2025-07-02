import { ApiError } from "../utils/apiError.js";    //  Import ApiError for handling errors
import { asyncHandler } from "../utils/asyncHandler.js";    // Import asyncHandler for handling asynchronous requests
import  jwt  from "jsonwebtoken";   // Import jsonwebtoken for handling JWT tokens    
import { User } from "../models/user.model.js"; // Import User model for database operations



export const verifyJwt =  asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")   // Get the access token from cookies or Authorization header
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")       
        }
    
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // Verify the token using the secret key from environment variables
    
        const user = await User.findById(decodedToken?._id).select( // Select specific fields to return
            // "-__v -createdAt -updatedAt -emailVerificationToken -emailVerified -reset
            "-password -refreshToken"   // Exclude sensitive fields like password and refreshToken from the response
        )
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;    // Attach the user object to the request for further processing in the route handlers
        // req.token = token;  // Attach the token to the request for further processing
        next()  // Call the next middleware or route handler in the stack   
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid tokens")
    }

})