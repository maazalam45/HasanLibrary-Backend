import { Book } from "../models/Book.js";



export const registerBook = async (req, res) => {
    try {
        const { title, author, isbn, category, copiesAvailable } = req.body;

        const newBook = new Book({ title, author, isbn, category, copiesAvailable });

        await newBook.save();


        res.status(201).json({ message: "Book registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
        const { title, author, isbn, category, copiesAvailable } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.category = category || book.category;
        book.copiesAvailable = copiesAvailable || book.copiesAvailable;

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