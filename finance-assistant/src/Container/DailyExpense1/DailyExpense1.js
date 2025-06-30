import React, { useState } from 'react'

const DailyExpense1 = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [formData, setFormData] = useState({
    id: null,
    date: '',
    category: '',
    amount: '',
    description: ''
});
const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

  const initialExpenses = [
    { id: 1, date: '2025-03-01', category: 'Food', amount: 45.50, description: 'Grocery shopping' },
    { id: 2, date: '2025-03-05', category: 'Transportation', amount: 35.00, description: 'Uber rides' },
    { id: 3, date: '2025-03-07', category: 'Utilities', amount: 120.75, description: 'Electricity bill' },
    { id: 4, date: '2025-03-10', category: 'Entertainment', amount: 65.00, description: 'Movie tickets and dinner' },
    { id: 5, date: '2025-03-15', category: 'Housing', amount: 1200.00, description: 'Monthly rent' },
  ];

  const getFilteredExpenses = () => {
    let filteredExpenses = [...expenses];

    // Apply search filter
    if (searchTerm) {
      filteredExpenses = filteredExpenses.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory) {
      filteredExpenses = filteredExpenses.filter(expense =>
        expense.category === filterCategory
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredExpenses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredExpenses;
  };
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  // Handle expense editing
  const handleEdit = (expense) => {
    setFormData(expense);
    setIsEditing(true);
    setShowForm(true);
  };
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
};

  return (
    <div className="table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th
              className="table-header sortable"
              onClick={() => requestSort('date')}
            >
              <div className="header-content">
                Date
                {sortConfig.key === 'date' && (
                  <span className={`sort-icon ${sortConfig.direction === 'desc' ? 'desc' : 'asc'}`}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th
              className="table-header sortable"
              onClick={() => requestSort('category')}
            >
              <div className="header-content">
                Category
                {sortConfig.key === 'category' && (
                  <span className={`sort-icon ${sortConfig.direction === 'desc' ? 'desc' : 'asc'}`}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th
              className="table-header sortable"
              onClick={() => requestSort('amount')}
            >
              <div className="header-content">
                Amount
                {sortConfig.key === 'amount' && (
                  <span className={`sort-icon ${sortConfig.direction === 'desc' ? 'desc' : 'asc'}`}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
            <th className="table-header">
              Description
            </th>
            <th className="table-header actions-header">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {getFilteredExpenses().map(expense => (
            <tr key={expense.id} className="table-row">
              <td className="table-cell">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="table-cell">
                <span className="category-tag">
                  {expense.category}
                </span>
              </td>
              <td className="table-cell amount-cell">
                ${parseFloat(expense.amount).toFixed(2)}
              </td>
              <td className="table-cell description-cell">
                {expense.description}
              </td>
              <td className="table-cell actions-cell">
                <button
                  onClick={() => handleEdit(expense)}
                  className="action-btn edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="action-btn delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
          {getFilteredExpenses().length === 0 && (
            <tr>
              <td colSpan="5" className="table-cell empty-message">
                No expenses found. Try clearing filters or add a new expense.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DailyExpense1;

