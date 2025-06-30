const express = require("express");
const budgetController = require("../../../controller/budget.controller");
const auth = require("../../../middleware/auth");

const router = express.Router();

// Protected routes - require authentication
router.use(auth(['user', 'admin']));

// http://localhost:8000/api/v1/budget/add
router.post("/add", budgetController.addBudget);

// http://localhost:8000/api/v1/budget/list
router.get("/list", budgetController.getBudgets);

// http://localhost:8000/api/v1/budget/analysis
router.get("/analysis", budgetController.getAnalysis);

// http://localhost:8000/api/v1/budget/:id
router.put("/:id", budgetController.updateBudget);

// http://localhost:8000/api/v1/budget/:id
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;