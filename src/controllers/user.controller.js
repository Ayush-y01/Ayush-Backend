import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloud } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { response } from "express";


const registerUser = asyncHandler( async (req, res, ) => {
    
    const {fullname, email, username, password} = req.body
    console.log("email: ", email);
    if ( 
        [fullname, email, username, password].some((field) => field?.trim() === "") 
    ) {
        throw new apiError(400, "all field are required")
    }


    const existeduser = User.findOne({
        $or: [{ username }, { email }]
    })

    
    if (existeduser) {
        throw new apiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is Require")
    }

    const avatar = await uploadOnCloud(avatarLocalPath)
    const coverImage = await uploadOnCloud(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar file is Require")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new apiError(500, "something went Wrong While registering user")
    }
    
    
    
} )



    return res.status(201).json(
        new ApiResponse(200, createduser, "user register successfull")
    )




export { registerUser }



// if (fullname === "") {
//     throw new apiError(400, "fullname is required")
// } ye validation ke liye tha or iss bhi advance code ab likhunga


// get user details from frontend - done
// validation - not empty
// check if user already exists : username , email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// retrun res