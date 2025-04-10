import express from "express"
import { forgetPassword, getUsers, loginUser, logoutUser, registerUser, resendOtp, resetPassword, verifyOtp } from "../controllers/userController.js";
import { checkAlreadyLoggedIn } from "../middleware/checkAlreadyLogin.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", checkAlreadyLoggedIn, registerUser);

userRoutes.post("/login", checkAlreadyLoggedIn, loginUser);

userRoutes.post("/verifyOtp", verifyOtp);

userRoutes.post("/resendOtp", resendOtp);

userRoutes.post("/forgetPassword", forgetPassword);

userRoutes.post("/resetPassword/:token", resetPassword);

userRoutes.post("/logout", logoutUser);

userRoutes.get("/getUsers", protect, roleMiddleware("admin"), getUsers);

export default userRoutes;
