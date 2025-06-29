// import { v2 as cloudinary } from 'cloudinary';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path  from 'path';

    // Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloud = async () => {
        console.log( " local file is available");

        await cloudinary.uploader.upload("./public/temp/avatarrr.png",)






        
        // try {
        //     if (!localFilePath) {
        //         console.log("❌ File path is missing.");
        //         return null
        //     }
        //     console.log("📂 Uploading file from:", localFilePath);

        //     const response = await cloudinary.uploader.upload(localFilePath, {
        //     resource_type: "auto",
        //     timeout: 120000,
        // });
        //     console.log(response);
            
            
        // } catch (error) {
        //     console.log("file not uploaded on cloud", error);
            
        // }
    }


export { uploadOnCloud }


//     cloudinary.uploader
// .upload("./public/temp/avatar.jpg",
//   { width: 2000, height: 1000, crop: "limit" })
// .then(result=>console.log(result));

// //     // const uploadOnCloud = async (localFilePath) => {
// //     //     console.log("this is local file :" , localFilePath);
        
// //     //     try {
// //     //         if (!localFilePath) return null
// //     //             console.log("this inside try block to check", localFilePath);
                
// //     //         // const stats = fs.statSync(localFilePath);
// //     //         //     console.log("File size (bytes):", stats.size);
// //     //         let response = await cloudinary.uploader.upload(localFilePath, {
// //     //             width:2000, height: 1000, crop: "limit"
                
// //     //             // resource_type: "auto",
// //     //             // timeout: 120000
// //     //         })
// //     //         // const response = await cloudinary.uploader.upload("./public/temp/avatar.jpeg")
// //     //         console.log("after the file upload on cloud ", response);
            
// //     //         //file has been uploaded successfully
// //     //         console.log("file has been uploaded on Cloudinary", response.url);
// //     //         return response;
// //     //     } catch (error) {
// //     //         console.log("Cloudinary failed to upload file",error);
            
// //     //         // if (localFilePath && fs.existsSync(localFilePath)) {
// //     //         //         fs.unlinkSync(localFilePath); // safe delete
// //     //         // }
// //     //         // // fs.unlinkSync(localFilePath) // remove the locally save temp file as the upload opration got failed
// //     //         return null;
            
// //     //     }
// //     // }


// //     // export { uploadOnCloud }
// //     // Upload an image
// //     //  const  uploadResult = await cloudinary.uploader
// //     //    .upload(
// //     //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
// //     //            public_id: 'shoes',
// //     //        }
// //     //    )
// //     //    .catch((error) => {
// //     //        console.log(error);
// //     //    });
    
// //     // console.log(uploadResult);
    
