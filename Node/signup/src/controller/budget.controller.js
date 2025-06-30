const Budget = require('../model/budget.model.js');

const addBudget = async (req, res) => {
    try {
        const budget = await Budget.create({
            ...req.body,
            userId: req.user._id
        });

        return res.status(201).json({
            success: true,
            data: budget,
            message: "Budget entry created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in servera: " + error.message
        });
    }
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id });

        return res.status(200).json({
            success: true,
            data: budgets,
            message: "Budgets retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Budget entry not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: budget,
            message: "Budget entry updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Budget entry not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: "Budget entry deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

const getAnalysis = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Find all budgets for the user within the date range
        const budgets = await Budget.find({ 
            userId: req.user._id,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
        
        // Calculate analysis data
        const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
        const categories = {};
        
        budgets.forEach(budget => {
            if (!categories[budget.category]) {
                categories[budget.category] = 0;
            }
            categories[budget.category] += budget.amount;
        });
        
        return res.status(200).json({
            success: true,
            data: {
                totalBudget,
                categories,
                count: budgets.length,
                budgets
            },
            message: "Budget analysis retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getAnalysis
}; 