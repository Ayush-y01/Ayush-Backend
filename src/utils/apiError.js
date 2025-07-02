class ApiError extends Error {  
    constructor(    
        statusCode, // HTTP status code
        message= "something went Wrong",    // Default message if none provided
        // data = null, // Additional data to include in the error response
        errors= [],// Array of error messages
        stack =""   // Stack trace for debugging
    ){
        super(message)  // Call the parent constructor with the message
        this.statusCode = statusCode    // Set the HTTP status code
        this.data =null // Placeholder for additional data, if needed
        this.message = message  // Set the error message
        this.success =false;    // Indicate that this is an error response
        this.errors = errors    // Set the array of error messages


        if (stack) {        // If a stack trace is provided, use it
            this.stack = stack  // Set the stack trace for debugging
        } else {    
            Error.captureStackTrace(this, this.constructor) // Capture the stack trace automatically
        }



    }
}

export {ApiError}