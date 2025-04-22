import express from "express"
import { forgetPassword, loginUser, logoutUser, registerUser, resendOtp, resetPassword, verifyOtp } from "../controllers/authController.js";
import { checkAlreadyLoggedIn } from "../middleware/checkAlreadyLogin.js";
import { protect } from "../middleware/authMiddleware.js";
import { forgetPassLimiter, loginLimiter, registerLimiter, resendOtpLimiter, verifyOtpLimiter } from "../middleware/rateLimit.js";


const authRoutes = express.Router();

authRoutes.post("/register", checkAlreadyLoggedIn, registerLimiter, registerUser);

authRoutes.post("/login", checkAlreadyLoggedIn, loginLimiter, loginUser);

authRoutes.post("/verifyOtp", verifyOtpLimiter, verifyOtp);

authRoutes.post("/resendOtp", resendOtpLimiter, resendOtp);

authRoutes.post("/forgetPassword", forgetPassLimiter, forgetPassword);

authRoutes.post("/resetPassword/:token", resetPassword);

authRoutes.post("/logout", protect, logoutUser);

export default authRoutes;
