import { Book } from "../models/Book.js";
// import { Borrow } from "../models/Borrow.js";

export const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: "No copies available" });
        }

        book.copiesAvailable -= 1;

        await book.save();

        res.json({ message: "Book borrowed successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }


        book.copiesAvailable += 1;

        await book.save();

        res.json({ message: "Book returned successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
