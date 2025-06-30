import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/NotoficationReminder/NotificationReminder.css';

const NotificationManager = () => {
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('billReminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  });

  useEffect(() => {
    checkReminders();
  }, []);

  useEffect(() => {
    // Check reminders every hour
    const interval = setInterval(checkReminders, 3600000);
    return () => clearInterval(interval);
  }, []);

  const checkReminders = () => {
    const now = new Date();
    const updatedReminders = reminders.map(reminder => {
      const dueDate = new Date(reminder.dueDate);
      const notifyDate = new Date(dueDate);
      notifyDate.setDate(dueDate.getDate() - parseInt(reminder.notifyBefore));

      if (
        now >= notifyDate &&
        now <= dueDate &&
        !reminder.notified
      ) {
        toast.info(`Reminder: ${reminder.title} is due on ${dueDate.toLocaleDateString()}. Amount: $${reminder.amount}`);
        return { ...reminder, notified: true };
      }
      return reminder;
    });

    setReminders(updatedReminders);
    localStorage.setItem('billReminders', JSON.stringify(updatedReminders));
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('billReminders', JSON.stringify(updatedReminders));
    toast.success('Reminder deleted successfully!');
  };

  return (
    <div className="reminder-container">
      <h2>Manage Reminders</h2>
      
      <div className="reminders-list">
        <h3>Upcoming Bills</h3>
        {reminders.length === 0 ? (
          <p>No reminders set</p>
        ) : (
          reminders
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(reminder => (
              <div key={reminder.id} className="reminder-card">
                <h4>{reminder.title}</h4>
                <p className="amount">Amount: ${reminder.amount}</p>
                <p className="due-date">
                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                </p>
                {reminder.description && (
                  <p className="description">{reminder.description}</p>
                )}
                <p className="notify-before">Notification: {reminder.notifyBefore} day(s) before</p>
                <p className="status">{reminder.notified ? 'Notified' : 'Pending'}</p>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationManager;