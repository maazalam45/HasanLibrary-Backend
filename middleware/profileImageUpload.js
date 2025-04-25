import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ProfileImage",
        format: async (req, file) => file.mimetype.split("/")[1],
        public_id: async (req, file) => {
            const uid = req.user?._id || uuidv4(); // fallback if user not found
            return `Profile_${uid}`;
        }

    },
});


const parser = multer({ storage: storage });

export default parser;