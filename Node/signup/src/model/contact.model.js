const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            minlength: [5, 'Subject must be at least 5 characters long']
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters long']
        },
        status: {
            type: String,
            enum: ['pending', 'responded', 'closed'],
            default: 'pending'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact; 