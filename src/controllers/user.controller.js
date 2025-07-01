import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloud } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { response } from "express";
import jwt from "jsonwebtoken"
// import { JsonWebTokenError } from "jsonwebtoken";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong will genrating access and refresh")
        
    }
}



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
    

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log("avatar local file", avatarLocalPath);//------------------------------------------------olmmmmoo
    

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is Require local")
    // }

    // console.log("avatar local file just before", avatarLocalPath);
    // if (!uploadOnCloud(avatarLocalPath)) {
    //     console.log("nulll avatar file not upload by cloud");
        
    // }
    // const avatarOnCloud = await uploadOnCloud(avatarLocalPath);
    // console.log("this just after avatar file upload",avatarLocalPath);
    
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

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new ApiError(500, "something went Wrong While registering user")
    }
    
    // console.log(req.body);
    
    
    return res.status(201).json(
        new ApiResponse(200, createduser, "user register successfull")
    )
    
    
} )


const loginUser = asyncHandler( async (req, res, ) => {
    // req body => data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie
    // response
    

    const { username, email, password } = req.body
    // console.log(email);
    

    if (!(username || email)) {
        throw new ApiError(400, "username or email is require")
    }

    const user = await User.findOne({ 
        $or: [ {username}, {email} ]
     })

     if (!user) {
        throw new ApiError(404, "user does not exist")
     }

    const isPasswordVaild = await user.isPasswordCorrect(password)
 
     if (!isPasswordVaild) {
        throw new ApiError(401, "password was Incorrect")
     }

     const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).
    select ("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            }, 
            "user logged in successfully"
        )
    )

})


const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))

})


const refreshAccessToken = asyncHandler( async (req, res) => {  // refresh access token
    // req body => refresh token
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken // taking refresh token from cookies or body

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

   try {
     const decodedToken = jwt.verify(   // verify the refresh token
         incomingRefreshToken,      // using jwt to verify the token
         process.env.REFRESH_TOKEN_SECRET // using the secret key to verify the token   
     )
 
     const user = await User.findById(decodedToken?._id)    // find the user by id from the decoded token
     // console.log("user in refresh token", user); 
     if (!user) {       
         throw new ApiError(401, "Invalid Refresh Token")       
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {         // if the incoming refresh token does not match the user's refresh token
         // console.log("incoming refresh token", incomingRefreshToken);
         throw new ApiError(401, " Refresh Token is expired or used ")  // throw an error
     }
 
     const options = {      // set the options for the cookies
        //  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
         httpOnly:true,         // httpOnly means the cookie cannot be accessed by JavaScript
        //  sameSite: "strict",    // sameSite means the cookie cannot be accessed by other sites      
         secure: true,  // secure means the cookie can only be accessed over HTTPS
        //  domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
     }
 
     const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)   // generate new access and refresh token
 
     return res     // return the response with the new access and refresh token
     .status(200)       
     .cookie("accessToken",accessToken, options ) // set the access token cookie
     .cookie("refreshToken", newrefreshToken ,options)  // set the refresh token cookie
     .json( // return the response with the new access and refresh token
         new ApiResponse(   // status code
             200,
             {accessToken, refreshToken: newrefreshToken},      // return the access and refresh token
             "Access token refreshed"
         )
     )
 
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid ")
   }
})


const changeCurrentPassword = asyncHandler( async (req,res,) => {   // change current password
    // req body => old password, new password, confirm password
    const {oldPassword, newPassword, confPassword} = req.body   // destructuring the req body   

    if (!(newPassword == confPassword)) {                       // check if the new password and confirm password are same
        throw new ApiError(401, "Password was Incorrect")       // throw an error if they are not same
    }

    const user = await User.findById(req.user?._id)             // find the user by id from the req.user object
    // if (!user) {                                                // if the user does not exist
    //     throw new ApiError(404, "User not found")
    // }                                                                       
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) // check if the old password is correct

    if (!isPasswordCorrect) {                                           // if the old password is not correct
        // console.log("old password is incorrect");    
        throw new ApiError(400, "Invalid old password")                 // throw an error
    }

    user.password = newPassword                                         // set the new password to the user object
    await user.save({       // save the user object to the database                 
        validateBeforeSave: false       // do not validate the user object before saving it
    })

    return res                  // return the response with the success message
        // .cookie("accessToken", user.generateAccessToken(), { // // set the access token cookie
        //     httpOnly: true,  // httpOnly means the cookie cannot be accessed by JavaScript
        //     sameSite: "strict", // sameSite means the cookie cannot be accessed by other sites
        //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        //     domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost",        

        //     secure: true,    // secure means the cookie can only be accessed over HTTPS
        //     // domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"      
        // })      
    .status(200)    // set the status code to 200
    .json(new ApiResponse(200, {}, "password changed successFully!!"))  // return the response with the success message


})


const getCurrentUser = asyncHandler( async (req, res,) => { // get current user
    return res.status(200)      // set the status code to 200
    .json(200, req.user, " Current user Fetched successfully")  // return the response with the current user object and success message
})


const updateAccountDetails = asyncHandler( async (req, res,) => {   // update account details
    // req body => fullname, email
    const {fullname, email} = req.body  // destructuring the req body

    if (!(fullname || email)) {     // check if fullname or email is present
        throw new ApiError(400, " all fields are require")
    }

    User.findByIdAndUpdate(     //  find the user by id and update the user object
        req.user?._id,          // using the user id from the req.user object
        {
            $set: {                 // set the fullname and email to the user object
                // username: username.toLowerCase(),    // username is not being updated here
                fullname: fullname,     // set the fullname to the user object
                email: email,           // set the email to the user object
            }
        },
        {new: true} // return the updated user object   
    ).select(" -password")      // select the user object without the password field


    return res          //  return the response with the updated user object and success message
    .status(200)        // set the status code to 200
    .json( new ApiResponse(200, user, "Account Details updated successfully"))  // return the response with the updated user object and success message

})

const updateUserAvatar = asyncHandler (async (req, res,) => {
    const avatarLocalPath = req.file?.path      // get the avatar file path from the req.file object

    if (!avatarLocalPath) {
        throw new ApiError(400, " Avatar file is missing")
    }

    const avatar = await uploadOnCloud(avatarLocalPath)     // upload the avatar file to cloudinary

    if (!avatar.url) {      // check if the avatar url is present
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(      // find the user by id and update the user object
        req.user?._id,      // using the user id from the req.user object
        {
            $set: {     // set the avatar url to the user object
                avatar: avatar.url  // set the avatar url to the user object
            }

        },
        {new: true}     // return the updated user object
    ).select(" -password")  // select the user object without the password field

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "update Avatar successfully")
    )

})

const updateUserCoverImage = asyncHandler (async (req, res,) => {
    const coverImageLocalPath = req.file?.path      // get the cover image file path from the req.file object

    if (!coverImageLocalPath) {
        throw new ApiError(400, " cover image file is missing")
    }

    const coverImage = await uploadOnCloud(coverImageLocalPath)     // upload the cover image file to cloudinary

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover Image")
    }

    const user = await User.findByIdAndUpdate(      // find the user by id and update the user object
        req.user?._id,      // using the user id from the req.user object
        {
            $set: {     //  set the cover image url to the user object
                coverImage: coverImage.url      //  set the cover image url to the user object
            }

        },
        {new: true}     // return the updated user object
    ).select(" -password")  // select the user object without the password field

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "update cover image successfully")
    )

})



export { registerUser,
         loginUser,
         logoutUser,
         refreshAccessToken,
         changeCurrentPassword,
         getCurrentUser,
         updateAccountDetails,
         updateUserAvatar,
         updateUserCoverImage
 }



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