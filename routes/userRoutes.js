import express from "express"
import { forgetPassword, loginUser, registerUser, resendOtp, resetPassword, verifyOtp } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);

userRoutes.post("/login", loginUser);

userRoutes.post("/verifyOtp", verifyOtp);

userRoutes.post("/resendOtp", resendOtp);

userRoutes.post("/forgetPassword", forgetPassword);

userRoutes.post("/resetPassword/:token", resetPassword);

export default userRoutes;
