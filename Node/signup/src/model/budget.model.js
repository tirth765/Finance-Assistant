const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SignupData',
            required: true
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget; 