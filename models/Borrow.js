import mongoose from "mongoose";


const { Schema } = mongoose;

const borrowSchema = new Schema({
    userId: { type: String, required: true },
    bookId: { type: String, required: true },
    borrowDate: { type: Date, default: Date.now, },
    returnDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["borrowed", "returned", "overdue", "reserved", "lost"],
        default: "borrowed"
    },
    addedAt: { type: Date, default: Date.now },
});

export const Borrow = mongoose.model("Borrow", borrowSchema);


