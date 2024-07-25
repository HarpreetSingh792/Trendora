import { v2 as cloudinary } from "cloudinary";
const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
export const uploadCloudinary = async (files) => {
    const promises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    });
    // file has been uploaded successfully
    const result = await Promise.all(promises);
    return result.map((i) => ({
        public_id: i.public_id,
        url: i.secure_url,
    }));
};
export const deleteFromCloudinary = async (publicIds) => {
    const promises = publicIds.map((id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, (error, result) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    });
    await Promise.all(promises);
};
