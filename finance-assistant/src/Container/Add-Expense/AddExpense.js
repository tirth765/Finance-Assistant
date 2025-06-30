import React, { useState } from "react";
import '../../css/AddExpense/AddExpense.css';
import { useDispatch } from "react-redux";
import { setAddExpense } from "../../redux/Slice/AddExpenseSlice";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: ''
  });

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
      await dispatch(setAddExpense(formData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      category: '',
      date: '',
      description: ''
    });
    navigate('/dashboard');
  };

  return (
    <div className="addexpense-body">
      <div className="addexpense-container1">
        <form className="addexpense-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="header">
              <h1>Add Expense</h1>
            </div>
          </div>
          <div className="addexp-form">
            <div className="form-group">
              <label>Amount:</label>
              <input 
                type="number" 
                id="amount" 
                name="amount" 
                value={formData.amount}
                onChange={handleChange} 
                className="form-control" 
                required
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                className="select-box form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" className="selectopt-cat">Select a category</option>
                <option value="food" className="option">Food</option>
                <option value="transportation" className="option">Transportation</option>
                <option value="housing" className="option">Housing</option>
                <option value="entertainment" className="option">Entertainment</option>
                <option value="utilities" className="option">Utilities</option>
                <option value="other" className="option">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                required
                style={{
                  colorScheme: "dark",
                  opacity: 1
                }}
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea 
                className="form-control" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please Enter Description"
                required
              />
            </div>

            <div className="form-action">
              <button type="submit" className="btn">Submit</button>
              <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;

