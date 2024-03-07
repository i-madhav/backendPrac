/*import { v2 as cloudinary} from "cloudinary";
import exp from "constants";
import fs from "fs"; //file system
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudnary = async (localFilePath) => {
    try{
        if(!localFilePath) return alert("Unable to find the path")
        // upload file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })
    
        //file has been uploaded successfully
        console.log("File uploaded successfully" , response.url);
    
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as upload operation got failed
        return null
    }
}*/

export {uploadOnCloudnary}

import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import exp from "constants";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudnary = async (localFilePath) => {
    try{
        if(!localFilePath) return alert("Unable to find the path");
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
        })

        console.log("Successful" , response.url);
        return response;
    }catch(error){
        console.error("Couldn't upload the file to cloudninary" , error.message);
        fs.unlink(localFilePath);
        return null;
    }
}

export {uploadOnCloudnary};