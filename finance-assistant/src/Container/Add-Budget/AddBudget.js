import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBudget } from "../../redux/Slice/BudgetSlice";
import { setAlert } from "../../redux/reducers/alert.js";
import '../../css/AddBudget/AddBudget.css';

const AddBudget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.budget);

  const [formData, setFormData] = useState({
    budgetAmount: '',
    category: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (error) {
      dispatch(setAlert(error, 'danger'));
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data to match the backend model
      const budgetData = {
        amount: parseFloat(formData.budgetAmount),
        category: formData.category,
        description: formData.description,
        date: formData.startDate, // Use startDate as the date field
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      
      console.log('Submitting budget data:', budgetData);
      
      // Dispatch the addBudget action and wait for it to complete
      const result = await dispatch(addBudget(budgetData)).unwrap();
      console.log('Budget added successfully:', result);
      
      // Show success message
      dispatch(setAlert('Budget added successfully', 'success'));
      
      // Navigate to ManageExpense page to see all budgets
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding budget:', err);
      dispatch(setAlert(err.message || 'Error adding budget', 'danger'));
    }
  };

  const handleCancel = () => {
    setFormData({
      budgetAmount: '',
      category: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    navigate('/dashboard/budgets');
  };

  return (
    <div className="addbudget-body">
      <div className="addbudget-container">
        <form className="addbudget-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="header">
              <h1>Add Budget</h1>
            </div>
          </div>
          <div className="addbudget-form">
            <div className="form-group">
              <label>Budget Amount:</label>
              <input 
                type="number" 
                id="budgetAmount" 
                name="budgetAmount" 
                value={formData.budgetAmount}
                onChange={handleChange} 
                className="form-control"
                required
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                // disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
                // disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
                required
                // disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter budget description"
                // disabled={loading}
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="submit-btn"
                // disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Budget'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
                // disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudget; 