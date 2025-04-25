import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Book } from "../models/Book.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "LibraryBookImage",
        format: async (req, file) => file.mimetype.split("/")[1],
        public_id: async (req, file) => {
            if (!req.params.id) {
                const isbn = req.body?.isbn?.trim() || null;
                const uniqueId = uuidv4(); // Generate random unique ID
                return isbn ? `book_${isbn}` : `book_${uniqueId}`;
            }
            else {
                try {
                    const book = await Book.findById(req.params.id);
                    if (book && book.isbn) {
                        return `book_${book.isbn}`;
                    }
                    return `book_${req.params.id}`;
                } catch (error) {
                    return `book_${req.params.id}`;
                }
            }
        },
    },
});


const parser = multer({ storage: storage });

export default parser;