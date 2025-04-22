import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { sendEmail } from "../helper/sendMail.js";
import { newOtp } from "../helper/otpGenerate.js";
import { otpEmailTemplate } from "../helper/otpMailTemplate.js";
import { forgetPassEmailTemplate } from "../helper/forgetEmailTemplate.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkExistingUser = await User.findOne({ email });
        if (checkExistingUser && !checkExistingUser.isVerified) {
            return res.status(409).json({ message: "OTP already sent to your Email" });
        }

        if (checkExistingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationOtp = await newOtp();

        const verificationAttempts = 0;
        const verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationOtp,
            verificationOtpExpires,
            verificationAttempts
        });

        const { subject, html } = otpEmailTemplate(verificationOtp, name, false);



        try {
            await sendEmail(email, subject, null, html);

            await newUser.save();

            res.status(201).json({ message: "OTP is sent to your email" });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            res.status(500).json({ message: "Failed to send verification email" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        const resendOtp = await newOtp();

        user.verificationOtp = resendOtp;
        user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.verificationAttempts = 0;

        const { subject, html } = otpEmailTemplate(resendOtp, user.name, true);

        try {
            await sendEmail(email, subject, null, html);
            await user.save();

            return res.status(200).json({ message: "OTP resent successfully" });
        } catch (emailError) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const verifyOtp = async (req, res) => {

    try {
        const { email, verificationOtp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.verificationAttempts >= 5) {
            return res.status(400).json({
                message: "Too many failed attempts",
                action: "resend_otp",
                description: "Please request a new verification code"
            });
        }

        if (user.verificationOtp !== verificationOtp) {
            user.verificationAttempts += 1;
            await user.save();

            if (user.verificationAttempts >= 5) {
                return res.status(400).json({
                    message: "Too many failed attempts",
                    action: "resend_otp",
                    description: "Please request a new verification code"
                });
            }

            const remainingAttempts = (5 - user.verificationAttempts) + 1;

            return res.status(400).json({
                message: "Invalid OTP",
                remainingAttempts,
                description: `You have ${remainingAttempts} attempt(s) remaining`
            });
        }

        if (user.verificationOtpExpires < new Date()) {
            return res.status(400).json({
                message: "OTP expired",
                action: "resend_otp",
                description: "Please request a new verification code"
            });
        }

        user.isVerified = true;
        user.verificationOtp = null;
        user.verificationOtpExpires = undefined;
        user.verificationAttempts = 0;

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "OTP verified", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkExistingUser = await User.findOne({ email });
        if (!checkExistingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (!checkExistingUser.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, checkExistingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: checkExistingUser._id, role: checkExistingUser.role, tokenVersion: checkExistingUser.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully!",
            token,
            user: {
                _id: checkExistingUser._id,
                name: checkExistingUser.name,
                email: checkExistingUser.email,
                role: checkExistingUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const checkExistingUser = await User.findOne({ email });
        if (!checkExistingUser) {
            return res.status(400).json({ message: "User not Found" });
        }

        if (!checkExistingUser.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        const token = jwt.sign(
            { id: checkExistingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        checkExistingUser.resetPasswordToken = token;
        checkExistingUser.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

        const resetLink = `${process.env.LOCAL_URL}api/authentication/resetPassword/${token}`
        const { subject, html } = forgetPassEmailTemplate(checkExistingUser.name, resetLink);

        try {
            await sendEmail(email, subject, null, html);
            await checkExistingUser.save();

            res.status(201).json({ message: "Reset Link is sent to your email" });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            res.status(500).json({ message: "Failed to send verification email" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isVerified) {
            return res.status(400).json({ message: "User Not Found" });
        }

        if (user.resetPasswordToken !== token) {
            return res.status(400).json({ message: "Invalid token" });
        }

        if (user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Token expired" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        user.password = hashed;

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.tokenVersion = user.tokenVersion + 1;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        });

        if (req.user) {
            const user = await User.findById(req.user._id);
            user.tokenVersion += 1;
            await user.save();
        };

        res.status(200).json({ message: "Logged out successfully" });

    }
    catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }

};

