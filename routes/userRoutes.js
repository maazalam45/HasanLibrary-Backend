import express from "express"
import { deleteMyAccount, getMyProfile, updateMyProfile, uploadProfileImage } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import parser from "../middleware/profileImageUpload.js";
import { profileImageLimiter } from "../middleware/rateLimit.js";

const userRoutes = express.Router();

userRoutes.get("/me", protect, getMyProfile);
userRoutes.post("/uploadProfile", protect, profileImageLimiter, parser.single("profileImage"), uploadProfileImage);
userRoutes.put("/me", protect, updateMyProfile);
userRoutes.delete("/me", protect, deleteMyAccount);

export default userRoutes;
