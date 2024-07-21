import { UserSchema } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/uitlity-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob, role } = req.body;
    let user = await UserSchema.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `WELCOME BACK ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return next(new ErrorHandler("Please Add all the fields", 400));
    }
    user = await UserSchema.create({
        _id,
        name,
        email,
        photo,
        role,
        gender,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    let user = await UserSchema.find({});
    return res.status(200).json({
        "success": true,
        user
    });
});
export const getUserById = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let user = await UserSchema.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({
        "success": true,
        user
    });
});
export const delUserById = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let user = await UserSchema.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    await user?.deleteOne();
    return res.status(200).json({
        "success": true,
        "messsage": "User Deleted Successfully"
    });
});
