import { Book } from "../models/Book.js";

export const registerBook = async (req, res) => {
    try {
        const { title, author, isbn, category, copiesAvailable, borrowPrice } = req.body;

        const bookImage = req.file ? req.file.path : "No Image Available";

        const newBook = new Book({ title, author, isbn, category, copiesAvailable, bookImage: bookImage, borrowPrice: Number(borrowPrice) });

        await newBook.save();


        res.status(201).json({ message: "Book registered successfully!" });

    } catch (error) {
        console.error(error); // for debugging
        res.status(500).json({
            message: "Server error",
            error: error.message, // ✅ Send readable message
        });
    }

};

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { title, author, isbn, category, copiesAvailable, borrowPrice } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const imageUrl = req.file?.path;

        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.category = category || book.category;
        book.borrowPrice = Number(borrowPrice) || book.borrowPrice;
        book.copiesAvailable = copiesAvailable || book.copiesAvailable;
        if (imageUrl) {
            book.bookImage = imageUrl || book.bookImage;
        }

        await book.save();
        res.json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        await book.deleteOne();
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};