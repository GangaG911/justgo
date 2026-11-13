import { v2 as cloudinary } from "cloudinary";
import process from "node:process";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image from user's device
const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
                folder: "justgo/wardrobe",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id
                });
            }
        );

        uploadStream.end(buffer);
    });
};

// Delete image from Cloudinary
const deleteImage = async(publicId) => {
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Unable to delete Cloudinary image");
    }

    return result;
};

export {
    uploadImage,
    deleteImage
};