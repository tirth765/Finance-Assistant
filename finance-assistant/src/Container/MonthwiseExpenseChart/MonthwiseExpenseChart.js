import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/MonthwiseExpenseChart/MonthwiseExpenseChart.css';

const COLORS = [
  '#7f5af0', '#2cb67d', '#ff6f61', '#f7c948', '#00C49F', '#0088FE', '#ffb700', '#ff4c4c', '#2d2d2d', '#1e1e1e', '#3a3a3a', '#444'
];

const MonthwiseExpenseChart = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [chartData, setChartData] = useState([]);

  // Get current date for initial values
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  //replay animation
  const [animationKey, setAnimationKey] = useState(0);
  useEffect(() => {
    if (budgets && Array.isArray(budgets)) {
      try {
        // ... your existing data processing ...
        setChartData(chartData);
        // Add this line to trigger animation replay
        setAnimationKey(prev => prev + 1);
      } catch (err) {
        setChartData([]);
        setAnimationKey(prev => prev + 1); // Also trigger on error for consistency
      }
    } else {
      setChartData([]);
      setAnimationKey(prev => prev + 1);
    }
  }, [budgets, selectedMonth, currentYear]);


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

  // Prepare category-wise data for PieChart
  useEffect(() => {
    if (budgets && Array.isArray(budgets)) {
      try {
        // Filter budgets for selected month in current year
        const monthBudgets = budgets.filter(budget => {
          if (!budget.date) return false;
          const budgetDate = new Date(budget.date);
          return budgetDate.getMonth() === selectedMonth &&
            budgetDate.getFullYear() === currentYear;
        });

        // Group expenses by category and calculate totals
        const categoryTotals = monthBudgets.reduce((acc, budget) => {
          const category = budget.category || 'Uncategorized';
          const amount = parseFloat(budget.amount) || 0;
          acc[category] = (acc[category] || 0) + amount;
          return acc;
        }, {});

        // Prepare data for PieChart
        const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2))
        }));

        setChartData(chartData);
      } catch (err) {
        console.error('Error processing chart data:', err);
        setChartData([]);
      }
    } else {
      setChartData([]);
    }
  }, [budgets, selectedMonth, currentYear]);

  const getMonthName = (monthIndex) => {
    return new Date(0, monthIndex).toLocaleString('en-US', { month: 'long' });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="monthwise-expense-chart-container dark-theme">
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="monthwise-expense-chart-container dark-theme">
        <div className="chart-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="monthwise-expense-chart-container dark-theme">
      <div className="chart-header">
        <h2>Category-wise Expense Distribution for {getMonthName(selectedMonth)} {currentYear}</h2>
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

      {chartData.length === 0 ? (
        <div className="no-data-message">
          No expenses recorded for {getMonthName(selectedMonth)} {currentYear}
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                key={animationKey}
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatCurrency}  labelFormatter={label => `${label}`} />
              <Legend  />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthwiseExpenseChart;