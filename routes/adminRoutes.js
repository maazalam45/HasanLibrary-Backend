import express from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const adminRoutes = express.Router();

adminRoutes.get("/getUsers", protect, roleMiddleware("admin"), getUsers);

adminRoutes.get("/getUser/:id", protect, roleMiddleware("admin"), getUserById);

adminRoutes.put("/updateUser/:id", protect, roleMiddleware("admin"), updateUser);

adminRoutes.delete("/deleteUser/:id", protect, roleMiddleware("admin"), deleteUser);

export default adminRoutes;