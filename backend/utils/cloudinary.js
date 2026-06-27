import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// 1. Configuration ko function ke bahar rakhein takki ye ek hi baar run ho
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check karein ki file path sach mein exist karta hai ya nahi
        if (!localFilePath) {
            console.error("Error: File path is missing.");
            return null;
        }

        // Cloudinary par upload karein
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Yeh image, video sab automatically detect kar leta hai
        });

        // Upload success hone ke baad local file ko delete karein
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response.secure_url; // Sahi URL return karein

    } catch (error) {
        console.error("Cloudinary Upload Failed:", error);

        // Agar upload fail bhi ho jaye, tab bhi temporary file ko delete karna zaroori hai
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null; // Taki call karne wale function ko pata chale ki upload fail hua h
    }
}

export default uploadOnCloudinary;