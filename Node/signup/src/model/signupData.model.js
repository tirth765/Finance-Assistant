const mongoose = require("mongoose");

const SignupDataSchema = new mongoose.Schema(
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
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long']
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: ['user', 'admin'],
            default: 'user'
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Remove refreshToken from JSON responses
SignupDataSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

const SignupData = mongoose.model("SignupData", SignupDataSchema);
module.exports = SignupData;