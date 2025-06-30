import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';
import '../../css/MonthwiseExpense/MonthwiseExpense.css';

const MonthwiseExpense = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [expenses, setExpenses] = useState([]);
  
  // Get current date for initial values
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();
  
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    console.log('Fetching budgets from MongoDB budget collection...');
    dispatch(getBudgets());
  }, [dispatch]);

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Filter budgets for selected month in current year
      const monthBudgets = budgets.filter(budget => {
        const budgetDate = new Date(budget.date);
        return budgetDate.getMonth() === selectedMonth && 
               budgetDate.getFullYear() === currentYear;
      });
      
      // Transform budget data to match expense format
      const transformedBudgets = monthBudgets.map(budget => ({
        id: budget._id,
        date: new Date(budget.date).toISOString().split('T')[0],
        category: budget.category,
        amount: budget.amount,
        description: budget.description || 'No description'
      }));
      
      setExpenses(transformedBudgets);
    } else {
      setExpenses([]);
    }
  }, [budgets, selectedMonth, currentYear]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMonthName = (monthIndex) => {
    return new Date(0, monthIndex).toLocaleString('en-US', { month: 'long' });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  return (
    <div className="monthwise-expense-container">
      <div className="monthwise-expense-card">
        <div className="monthwise-expense-header">
          <h2>Monthly Expenses - {currentYear}</h2>
          <div className="month-selector">
            <select 
              value={selectedMonth} 
              onChange={handleMonthChange}
              className="month-select"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{getMonthName(i)}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="no-expenses">
            No expenses recorded for {getMonthName(selectedMonth)} {currentYear}
          </div>
        ) : (
          <div className="expenses-table-container">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthwiseExpense; 