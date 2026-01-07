import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadImgOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_KEY,
  });
};
try {
  const uploadResult = await cloudinary.uploader.upload(filePath);
  fs.unlinkSync(filePath);
  return uploadResult.secure_url;
} catch (error) {
  fs.unlinkSync(filePath);
  return res.status(500).json({
    message:"Cloudinary Error"
  })
}

export default uploadImgOnCloudinary;