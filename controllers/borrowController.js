import { Book } from "../models/Book.js";
import { Borrow } from "../models/Borrow.js";
import { User } from "../models/User.js";
import Stripe from "stripe";

export const onlinePayment = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_API_SECRET);
        const book = await Book.findById(req.params.id);  // Ensure you are getting the book details

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Define your success and cancel URLs
        const SUCCESS_DOMAIN = process.env.LOCAL_URL;
        const CANCEL_DOMAIN = process.env.LOCAL_URL;

        // Stripe session creation
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],  // We're accepting card payments
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',  // Set the currency to PKR (Pakistani Rupees)
                        product_data: {
                            name: book.title,  // Book title
                            description: book.author,  // You can add more info like the author
                        },
                        unit_amount: book.borrowPrice * 100,  // Stripe expects the price in cents
                    },
                    quantity: 1,  // Always 1 book for each borrow transaction
                },
            ],
            mode: 'payment',
            success_url: `${SUCCESS_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,  // Customize this URL
            cancel_url: `${CANCEL_DOMAIN}/payment-cancelled?canceled=true`,  // Customize this URL
        });

        // Redirect to the Stripe checkout page
        res.redirect(303, session.url);

    } catch (error) {
        console.error("Error in online payment session:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: "No copies available" });
        }

        book.copiesAvailable -= 1;

        await book.save();

        const borrowDate = new Date();

        const borrowBook = new Borrow({
            userId: user._id,
            bookId: book._id,
            borrowDate,
            returnDate: new Date(Date.now() + 7 * 24 * 60 * 1000) || new Date(Date.now() + 14 * 24 * 60 * 1000) || new Date(Date.now() + 30 * 24 * 60 * 1000)
        })

        await borrowBook.save();

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
