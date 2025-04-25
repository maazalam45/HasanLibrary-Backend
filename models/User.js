import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        role: {
            type: String,
            enum: ["user", "admin", "librarian"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        verificationOtp: {
            type: String,
        },
        verificationOtpExpires: {
            type: Date
        },
        verificationAttempts: {
            type: Number,
            default: 0
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
        tokenVersion: {
            type: Number,
            default: 0
        },
        profileImage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);


