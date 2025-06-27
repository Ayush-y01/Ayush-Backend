import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


    const uploadOnCloud = async (localFilePath) => {
        try {
            if (!localFilePath) return null
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            //file has been uploaded 
            console.log("file has been uploaded on Cloudinary", response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally save temp file as the upload opration got failed
            return null;
            
        }
    }


    export {uploadOnCloud}
    // Upload an image
    //  const  uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
