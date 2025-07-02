class ApiResponse {
    constructor(statusCode, data, message = "Success"    ){ // Constructor to initialize the ApiResponse object
        this.statusCode = statusCode    // HTTP status code
        this.data = data    // Data to include in the response
        this.message = message  // Response message
        this.success = statusCode < 400  // Success flag
    }
}

export { ApiResponse }