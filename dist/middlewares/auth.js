import { UserSchema } from "../models/user.js";
import ErrorHandler from "../utils/uitlity-class.js";
import { TryCatch } from "./error.js";
export const isAdmin = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please Login First", 401));
    const user = await UserSchema.findById(id);
    if (!(user?.role === "admin"))
        return next(new ErrorHandler("You are not an Admin", 401));
    return next();
});
