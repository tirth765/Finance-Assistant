import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';
import '../../css/YearwiseExpense/YearwiseExpense.css';

const YearwiseExpense = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [expenses, setExpenses] = useState([]);
  
  // Get current year and set up year selection
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Generate years from current year to 10 years back
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  
  useEffect(() => {
    console.log('Fetching budgets from MongoDB budget collection...');
    dispatch(getBudgets());
  }, [dispatch]);

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Filter budgets for the selected year
      const yearBudgets = budgets.filter(budget => {
        const budgetYear = new Date(budget.date).getFullYear();
        return budgetYear === selectedYear;
      });
      
      // Transform budget data to match expense format
      const transformedBudgets = yearBudgets.map(budget => ({
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
  }, [budgets, selectedYear]);

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

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className="yearwise-expense-container">
      <div className="yearwise-expense-card">
        <div className="yearwise-expense-header">
          <h2>Yearly Expenses</h2>
          <div className="year-selector">
            <select 
              value={selectedYear} 
              onChange={handleYearChange}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
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
            No expenses recorded for {selectedYear}
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

export default YearwiseExpense; 