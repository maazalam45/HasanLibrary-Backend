import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    copiesAvailable: { type: Number, required: true, min: 0 },
    bookImage: {
        type: String,
        default: "",
    },
    addedAt: { type: Date, default: Date.now },
});

export const Book = mongoose.model("Book", bookSchema);


