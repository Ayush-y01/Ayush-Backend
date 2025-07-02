const asyncHandler = (requestHandler) => {  // Function to handle asynchronous requests
    // It takes a request handler function as an argument
    return (req, res, next) => {    // Function that returns a new function
        // This new function takes req, res, and next as arguments
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))   // Execute the request handler and catch any errors
        // If an error occurs, it will be passed to the next middleware
    }
}

export { asyncHandler}




// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }