const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SignupData',
            required: true,
            unique: true
        },
        avatar: {
            type: String,
            default: ''
        },
        phoneNumber: {
            type: String,
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        },
        dateOfBirth: {
            type: Date
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String
        },
        occupation: {
            type: String,
            trim: true
        },
        monthlyIncome: {
            type: Number,
            min: [0, 'Monthly income cannot be negative']
        },
        preferences: {
            currency: {
                type: String,
                default: 'USD'
            },
            language: {
                type: String,
                default: 'en'
            },
            notifications: {
                email: {
                    type: Boolean,
                    default: true
                },
                push: {
                    type: Boolean,
                    default: true
                }
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile; 