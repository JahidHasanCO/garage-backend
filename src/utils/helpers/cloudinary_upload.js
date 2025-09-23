// helpers/cloudinaryUpload.js
import cloudinary from "../../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder = "temp") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};
