import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (buffer) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!buffer) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
            return;
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
