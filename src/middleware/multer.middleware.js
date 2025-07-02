import multer from "multer";  // Import multer for handling file uploads


//Disk Storage
const storage = multer.diskStorage({  // Set up disk storage for uploaded files
  // destination and filename functions to specify where to store the files 
  destination: function (req, file, cb) { // Set the destination directory for uploaded files
    // cb(null, "./public/uploads/")  // Uncomment this line to use a different
    cb(null, "./public/temp/")  // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {  // Set the filename for the uploaded file
    cb(null, file.originalname) // Use the original file name for the uploaded file
    // cb(null, `${Date.now()}-${file.originalname}`) // Alternatively, you can use a timestamp to avoid name conflicts
  }
})

export const upload = multer({ storage, })  // Create a multer instance with the specified storage configuration
