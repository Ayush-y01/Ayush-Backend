import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
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
        throw new ApiError(400, "all field are required")
    }


    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })

    
    if (existeduser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files);
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log("avatar local file", avatarLocalPath);//------------------------------------------------olmmmmoo
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is Require local")
    }

    console.log("avatar local file just before", avatarLocalPath);
    // if (!uploadOnCloud(avatarLocalPath)) {
    //     console.log("nulll avatar file not upload by cloud");
        
    // }
    // const avatarOnCloud = await uploadOnCloud(avatarLocalPath);
    console.log("this just after avatar file upload",avatarLocalPath);
    
    // const coverImageOnCloud = await uploadOnCloud(coverImageLocalPath);

    // if (!avatarOnCloud) {
    //     throw new ApiError(400, "Avatar file is Require on cloud")
    // }

    const user = await User.create({
        fullname,
        // avatar: avatarLocalPath.url,
        // coverImage: coverImageOnCloud?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new ApiError(500, "something went Wrong While registering user")
    }
    
    
    return res.status(201).json(
        new ApiResponse(200, createduser, "user register successfull")
    )
    
} )







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