import multer from "multer";


export const singleUpload=multer().single("photo")
export const multiUploads=multer().array("photo",5)

