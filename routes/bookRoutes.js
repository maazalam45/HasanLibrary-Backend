import express from "express"
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { deleteBook, getBookById, getBooks, registerBook, updateBook } from "../controllers/bookController.js";


const bookRoutes = express.Router();

bookRoutes.post("/registerBook", protect, roleMiddleware("admin"), registerBook);

bookRoutes.get("/getBooks", protect, roleMiddleware("admin", "librarian", "user"), getBooks);

bookRoutes.get("/:id", protect, roleMiddleware("admin", "librarian", "user"), getBookById);

bookRoutes.put("/updateBook/:id", protect, roleMiddleware("admin", "librarian"), updateBook);

bookRoutes.delete("/deleteBook/:id", protect, roleMiddleware("admin", "librarian"), deleteBook);

export default bookRoutes;