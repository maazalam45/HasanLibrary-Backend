import express from "express"
import { deleteMyAccount, getMyProfile, updateMyProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.get("/me", protect, getMyProfile);
userRoutes.put("/me", protect, updateMyProfile);
userRoutes.delete("/me", protect, deleteMyAccount);

export default userRoutes;
