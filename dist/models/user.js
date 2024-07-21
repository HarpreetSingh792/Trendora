import mongoose from "mongoose";
import validator from "validator";
const Schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    name: {
        type: String,
        require: [true, "Please enter Name"],
    },
    email: {
        type: String,
        require: [true, "Please enter Email"],
        unique: [true, "Email Already Exist"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of Birth"],
    },
}, {
    timestamps: true,
});
Schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const UserSchema = mongoose.model("User", Schema);
