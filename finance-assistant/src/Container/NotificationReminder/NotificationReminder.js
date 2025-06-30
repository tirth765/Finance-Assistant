// export default NotificationReminder;
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/NotoficationReminder/NotificationReminder.css';

const NotificationReminder = () => {
  const [newReminder, setNewReminder] = useState({
    title: '',
    amount: '',
    dueDate: '',
    description: '',
    notifyBefore: '1', // days before due date
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.amount || !newReminder.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const reminder = {
      ...newReminder,
      id: Date.now(),
      notified: false,
      created: new Date().toISOString()
    };

    // Get existing reminders from localStorage
    const existingReminders = JSON.parse(localStorage.getItem('billReminders') || '[]');
    // Add new reminder
    const updatedReminders = [...existingReminders, reminder];
    // Save back to localStorage
    localStorage.setItem('billReminders', JSON.stringify(updatedReminders));

    setNewReminder({
      title: '',
      amount: '',
      dueDate: '',
      description: '',
      notifyBefore: '1'
    });
    toast.success('Reminder added successfully!');
  };

  return (
    <div className="reminder-container">
      <h2>Add Bill Reminder</h2>
      
      <form onSubmit={handleSubmit} className="reminder-form">
        <div className="form-group">
          <label>Bill Title:</label>
          <input
            type="text"
            name="title"
            value={newReminder.title}
            onChange={handleInputChange}
            placeholder="Enter bill title"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={newReminder.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={newReminder.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Notify Before (days):</label>
          <select
            name="notifyBefore"
            value={newReminder.notifyBefore}
            onChange={handleInputChange}
          >
            <option value="1">1 day</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="5">5 days</option>
            <option value="7">1 week</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={newReminder.description}
            onChange={handleInputChange}
            placeholder="Enter description (optional)"
          />
        </div>

        <button type="submit" className="submit-btn">Add Reminder</button>
      </form>
    </div>
  );
};

export default NotificationReminder;