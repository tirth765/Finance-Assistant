// ExpenseManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets, deleteBudget, updateBudget } from '../../redux/Slice/BudgetSlice';
import { useNavigate } from 'react-router-dom';
import '../../css/ManageExpense/ManageExpense.css';

const ManageExpense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { budgets, loading, error } = useSelector((state) => state.budget);

    // State variables
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        date: '',
        category: '',
        amount: '',
        description: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Categories for dropdown
    const categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

    // Fetch budgets when component mounts
    useEffect(() => {
        console.log('Fetching budgets from MongoDB budget collection...');
        dispatch(getBudgets());
    }, [dispatch]);

    // Fetch budgets after successful update
    useEffect(() => {
        if (updateSuccess) {
            console.log('Update was successful, refreshing data from database...');
            dispatch(getBudgets());
            setUpdateSuccess(false);
        }
    }, [updateSuccess, dispatch]);

    // Update expenses when budgets change
    useEffect(() => {
        console.log('Budgets state changed:', budgets);
        console.log('Loading state:', loading);
        console.log('Error state:', error);
        
        if (budgets && budgets.length > 0) {
            console.log('Received budgets from MongoDB budget collection:', budgets);
            // Transform budget data to match expense format
            const transformedBudgets = budgets.map(budget => ({
                id: budget._id,
                date: new Date(budget.date).toISOString().split('T')[0],
                category: budget.category,
                amount: budget.amount,
                description: budget.description || 'No description'
            }));
            console.log('Transformed budgets:', transformedBudgets);
            setExpenses(transformedBudgets);
        } else {
            console.log('No budgets found in MongoDB budget collection');
            setExpenses([]);
        }
    }, [budgets, loading, error]);

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle delete budget
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            dispatch(deleteBudget(id));
        }
    };

    // Handle edit budget
    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setEditForm({
            date: expense.date,
            category: expense.category,
            amount: expense.amount,
            description: expense.description
        });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({
            date: '',
            category: '',
            amount: '',
            description: ''
        });
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        // Find the original budget to get the _id
        const originalBudget = budgets.find(budget => budget._id === editingId);
        
        if (originalBudget) {
            // Create updated budget object with the correct format for the API
            const updatedBudgetData = {
                date: editForm.date,
                category: editForm.category,
                amount: parseFloat(editForm.amount),
                description: editForm.description
            };
            
            console.log('Updating budget with ID:', editingId);
            console.log('Updated budget data:', updatedBudgetData);
            
            try {
                // Dispatch update action with the correct format
                const result = await dispatch(updateBudget({ 
                    id: editingId, 
                    data: updatedBudgetData 
                })).unwrap();
                
                console.log('Update successful:', result);
                
                // Set update success flag to trigger data refresh
                setUpdateSuccess(true);
                
                // Reset edit state
                setEditingId(null);
                setEditForm({
                    date: '',
                    category: '',
                    amount: '',
                    description: ''
                });
                
                // Show success message
                alert('Budget updated successfully!');
            } catch (error) {
                console.error('Error updating budget:', error);
                alert('Failed to update budget: ' + (error.message || 'Unknown error'));
            }
        }
    };

    // Filter and sort expenses for display
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

    // Log the filtered expenses for debugging
    useEffect(() => {
        console.log('Filtered expenses:', getFilteredExpenses());
    }, [expenses, searchTerm, filterCategory, sortConfig]);

    return (
        <div className="expense-container">
            <div className="expense-header">
                <h1 className="expense-title">Budget Management</h1>
            </div>

            {/* Search and Filter Controls */}
            <div className="controls-container">
                <div className="search-container">
                                <input
                                    type="text"
                        placeholder="Search budgets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                <div className="filter-container">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                </div>
            </div>

            {/* Budgets Table */}
            <div className="table-container">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('date')} className="sortable">
                                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('category')} className="sortable">
                                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('amount')} className="sortable">
                                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading-message">Loading budgets from MongoDB budget collection...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="error-message">Error: {error}</td>
                            </tr>
                        ) : getFilteredExpenses().length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data-message">No budgets found in MongoDB budget collection</td>
                            </tr>
                        ) : (
                            getFilteredExpenses().map(expense => (
                                <tr key={expense.id}>
                                    {editingId === expense.id ? (
                                        // Edit form row
                                        <>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={editForm.date}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    name="category"
                                                    value={editForm.category}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                >
                                                    {categories.map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={editForm.amount}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                    min="0"
                                                    step="0.01"
                                                />
                                </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={editForm.description}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                />
                                </td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="save-btn"
                                                    onClick={handleSubmitEdit}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                </td>
                                        </>
                                    ) : (
                                        // Display row
                                        <>
                                            <td>{expense.date}</td>
                                            <td>{expense.category}</td>
                                            <td>${parseFloat(expense.amount).toFixed(2)}</td>
                                            <td>{expense.description}</td>
                                            <td className="action-buttons">
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
                                </td>
                                        </>
                                    )}
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageExpense;