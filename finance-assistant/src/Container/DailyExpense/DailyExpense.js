import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets, deleteBudget, updateBudget } from '../../redux/Slice/BudgetSlice';
import '../../css/DailyExpense/DailyExpense.css';

const DailyExpense = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: '',
    amount: '',
    description: ''
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    console.log('Fetching budgets from MongoDB budget collection...');
    dispatch(getBudgets());
  }, [dispatch]);

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Filter budgets for today's date
      const todayBudgets = budgets.filter(budget => {
        const budgetDate = new Date(budget.date).toISOString().split('T')[0];
        return budgetDate === today;
      });
      
      // Transform budget data to match expense format
      const transformedBudgets = todayBudgets.map(budget => ({
        id: budget._id,
        date: new Date(budget.date).toISOString().split('T')[0],
        category: budget.category,
        amount: budget.amount,
        description: budget.description || 'No description'
      }));
      
      setExpenses(transformedBudgets);
      
      // Calculate total amount for today
      const total = transformedBudgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
      setTotalAmount(total);
    } else {
      setExpenses([]);
      setTotalAmount(0);
    }
  }, [budgets, today]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await dispatch(deleteBudget(expenseId));
        dispatch(getBudgets()); // Refresh the data
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense.id);
    setEditFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data correctly for the API
      const updatedData = {
        category: editFormData.category,
        amount: parseFloat(editFormData.amount),
        description: editFormData.description
      };

      // Dispatch the update action with the correct format
      await dispatch(updateBudget({
        id: editingExpense,
        data: updatedData
      }));

      // Reset the editing state
      setEditingExpense(null);
      setEditFormData({
        category: '',
        amount: '',
        description: ''
      });

      // Refresh the data
      dispatch(getBudgets());
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditFormData({
      category: '',
      amount: '',
      description: ''
    });
  };

  return (
    <div className="daily-expense-container">
      <div className="daily-expense-card">
        <div className="daily-expense-header">
          <h2>Today's Expenses</h2>
          <div className="date-display">
            <span>{formatDate(today)}</span>
          </div>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <div className="date-summary">
          <h3>Today's Summary</h3>
          <div className="total-amount">
            Total: <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading today's expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="no-expenses">
            No expenses recorded for today
          </div>
        ) : (
          <div className="expenses-list">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                {editingExpense === expense.id ? (
                  <form className="edit-form" onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditChange}
                        placeholder="Category"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        name="amount"
                        value={editFormData.amount}
                        onChange={handleEditChange}
                        placeholder="Amount"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-btn">Save</button>
                      <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="expense-info">
                      <div className="expense-title">{expense.description}</div>
                      <div className="expense-category">{expense.category}</div>
                      <div className="expense-time">{formatTime(expense.date)}</div>
                    </div>
                    <div className="expense-amount">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div className="expense-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyExpense;