import express from "express"
import { loginUser, registerUser, resendOtp, verifyOtp } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);

userRoutes.post("/login", loginUser);

userRoutes.post("/verifyOtp", verifyOtp);

userRoutes.post("/resendOtp", resendOtp);

export default userRoutes;
