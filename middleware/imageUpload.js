import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "LibraryBookImage",
        format: async (req, file) => file.mimetype.split("/")[1],
        public_id: async (req, file) => {
            const isbn = req.body?.isbn?.trim() || null;
            const uniqueId = uuidv4(); // Generate random unique ID
            return isbn ? `book_${isbn}` : `book_${uniqueId}`;
        },
    },
});


const parser = multer({ storage: storage });

export default parser;