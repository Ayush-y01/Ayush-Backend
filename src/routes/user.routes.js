import { Router } from "express";       // Import Router from express to create a new router instance
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";    // Import user controller functions for handling user-related operations
import { upload } from "../middleware/multer.middleware.js"         // Import multer middleware for handling file uploads
// import { verify } from "jsonwebtoken";
import { verifyJwt } from "../middleware/auth.middleware.js";   // Import middleware for verifying JWT tokens


const router = Router() // Create a new router instance

router.route("/register").post( // Register a new user
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,

        },
        {
            name: "coverImage",
            maxCount: 1,
            
        }
    ]),
    registerUser)


router.route("/login").post(loginUser)  //  Login a user




//secure routes
router.route("/logout").post(verifyJwt, logoutUser) // Logout a user, requires JWT verification
router.route("/refresh-token").post(refreshAccessToken) // Refresh access token, requires JWT verification

export default router