
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import otpGenerator from "otp-generator";
import { sendEmail } from "../helper/sendMail.js";
import { newOtp } from "../helper/otpGenerate.js";




export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const checkExistingUser = await User.findOne({ email });
        if (checkExistingUser) {
            return res.status(400).json({ message: "Email already exists" });
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

        const emailSubject = "OTP To Verify Your Email Address";
        const htmlText = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
    <h2 style="margin-bottom: 20px; font-weight: 500; color: #111;">Verify your email address</h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
      Hello ${name},
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
      To complete your sign-up process, please use the verification code below. This code is valid for the next 10 minutes.
    </p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f8f8f8; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #222;">
      ${verificationOtp}
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      If you did not request this, you can safely ignore this email.
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      Thank you,<br>
      The My App Team
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      This is an automated message.
    </p>
  </div>
`;


        try {
            await sendEmail(email, emailSubject, null, htmlText);

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
        const { email, name } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        const resendOtp = await newOtp();

        user.verificationOtp = resendOtp;
        user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.verificationAttempts = 0;

        const emailSubject = "Resend OTP to Verify Your Email Address";
        const htmlText = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
    <h2 style="margin-bottom: 20px; font-weight: 500; color: #111;">Verify your email address</h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
      Hello ${name || user.name},
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
      To complete your sign-up process, please use the verification code below. This code is valid for the next 10 minutes.
    </p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f8f8f8; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #222;">
      ${resendOtp}
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      If you did not request this, you can safely ignore this email.
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      Thank you,<br>
      The My App Team
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      This is an automated message.
    </p>
  </div>
`;



        try {
            await sendEmail(email, emailSubject, null, htmlText);
            await user.save();

            return res.status(200).json({ message: "OTP resent successfully" });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return res.status(500).json({ message: "Failed to send verification email" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const verifyOtp = async (req, res) => {
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

        if (user.verificationAttempts > 5) {
            return res.status(400).json({
                message: "Too many failed attempts",
                action: "resend_otp",
                description: "Please request a new verification code"
            });
        }

        const remainingAttempts = 5 - user.verificationAttempts;

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
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({ message: "OTP verified", token });
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
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: checkExistingUser._id, role: checkExistingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

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
