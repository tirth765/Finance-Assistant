import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/DailyExpenseChart/DailyExpenseChart.css';

const DailyExpenseChart = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [chartData, setChartData] = useState([]);
  
  // Get current date for initial values
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(currentDate.toISOString().split('T')[0]);

  // Fetch budgets data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getBudgets());
      } catch (err) {
        console.error('Error fetching budgets:', err);
      }
    };
    fetchData();
  }, [dispatch]);

  // Process data for the chart
  useEffect(() => {
    if (budgets && Array.isArray(budgets)) {
      try {
        // Filter budgets for selected date
        const dayBudgets = budgets.filter(budget => {
          if (!budget.date) return false;
          const budgetDate = new Date(budget.date).toISOString().split('T')[0];
          return budgetDate === selectedDate;
        });
        
        // Group expenses by category and calculate totals
        const categoryTotals = dayBudgets.reduce((acc, budget) => {
          const category = budget.category || 'Uncategorized';
          const amount = parseFloat(budget.amount) || 0;
          acc[category] = (acc[category] || 0) + amount;
          return acc;
        }, {});

        // Transform data for the chart
        const chartData = Object.entries(categoryTotals)
          .map(([name, value]) => ({
            name,
            amount: parseFloat(value.toFixed(2))
          }))
          .sort((a, b) => b.amount - a.amount); // Sort by amount descending

        setChartData(chartData);
      } catch (err) {
        console.error('Error processing chart data:', err);
        setChartData([]);
      }
    } else {
      setChartData([]);
    }
  }, [budgets, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="daily-expense-chart-container">
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-expense-chart-container">
        <div className="chart-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="daily-expense-chart-container">
      <div className="chart-header">
        <h2>Daily Expense Distribution</h2>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="no-data-message">
          No expenses recorded for {formatDate(selectedDate)}
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Amount']}
              />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DailyExpenseChart; 