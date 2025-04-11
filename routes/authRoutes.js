import express from "express"
import { forgetPassword, loginUser, logoutUser, registerUser, resendOtp, resetPassword, verifyOtp } from "../controllers/authController.js";
import { checkAlreadyLoggedIn } from "../middleware/checkAlreadyLogin.js";
// import { roleMiddleware } from "../middleware/roleMiddleware.js";
// import { protect } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", checkAlreadyLoggedIn, registerUser);

authRoutes.post("/login", checkAlreadyLoggedIn, loginUser);

authRoutes.post("/verifyOtp", verifyOtp);

authRoutes.post("/resendOtp", resendOtp);

authRoutes.post("/forgetPassword", forgetPassword);

authRoutes.post("/resetPassword/:token", resetPassword);

authRoutes.post("/logout", logoutUser);



export default authRoutes;
