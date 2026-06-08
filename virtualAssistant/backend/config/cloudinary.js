import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const uploadOnCloudinary= async (filePath)=>{
   cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret:  process.env.CLOUDINARY_API_SECRET //* Click 'View API Keys' above to copy your API secret
    });

    try{
    const uploadResult = await cloudinary.uploader.upload(filePath);
         if(fs.existsSync(filePath)){ 
            fs.unlinkSync(filePath); 
        }
         console.log(uploadResult.secure_url);
       return uploadResult.secure_url;
    }
    catch(error){
         console.log(error);
          if(fs.existsSync(filePath)){
         fs.unlinkSync(filePath);
      }

          console.log(error);
            throw new Error(error.message);
        // throw new Error("Cloudinary upload failed");
        //return res.status(500).json({message: "cloudinary error"});
    }
}
export default uploadOnCloudinary;