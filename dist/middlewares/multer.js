import multer from "multer";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const extName = file.originalname.split(".").pop(); // This will split the string from "." insert into array and pop out the last element i.e.=> extension like .png and .jpeg
        const pathname = `${uuid()}.${extName}`;
        callback(null, pathname);
    },
});
export const singleUpload = multer({ storage }).single("photo");
