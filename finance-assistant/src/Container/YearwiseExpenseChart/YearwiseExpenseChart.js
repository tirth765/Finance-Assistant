import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../css/YearwiseExpenseChart/YearwiseExpenseChart.css'

const COLORS = [
  '#7f5af0', '#2cb67d', '#ff6f61', '#f7c948', '#00C49F', '#0088FE', '#ffb700', '#ff4c4c', '#2d2d2d', '#1e1e1e', '#3a3a3a', '#444'
];

const YearwiseExpenseChart = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getBudgets());
  }, [dispatch]);

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      // Get all unique categories
      const allCategories = Array.from(
        new Set(budgets.map(b => b.category || 'Uncategorized'))
      );

      // Group by year and category
      const yearlyCategoryTotals = {};
      budgets.forEach(budget => {
        if (!budget.date) return;
        const year = new Date(budget.date).getFullYear();
        const category = budget.category || 'Uncategorized';
        const amount = parseFloat(budget.amount) || 0;
        if (!yearlyCategoryTotals[year]) yearlyCategoryTotals[year] = {};
        yearlyCategoryTotals[year][category] = (yearlyCategoryTotals[year][category] || 0) + amount;
      });

      // Transform to array for recharts
      const data = Object.entries(yearlyCategoryTotals)
        .map(([year, catTotals]) => {
          const entry = { year };
          allCategories.forEach(cat => {
            entry[cat] = parseFloat((catTotals[cat] || 0).toFixed(2));
          });
          return entry;
        })
        .sort((a, b) => a.year - b.year);

      setCategories(allCategories);
      setChartData(data);
    } else {
      setChartData([]);
      setCategories([]);
    }
  }, [budgets]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);

  if (loading) {
    return (
      <div className="yearwise-expense-chart-container dark-theme">
        <div className="chart-loading">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="yearwise-expense-chart-container dark-theme">
        <div className="chart-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="yearwise-expense-chart-container dark-theme">
      <div className="chart-header">
        <h2>Yearly Category-wise Expense Bar Chart</h2>
      </div>
      {chartData.length === 0 ? (
        <div className="no-data-message">No expenses recorded for any year</div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            {/* <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              {categories.map((cat, idx) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  fill={COLORS[idx % COLORS.length]}
                  name={cat}
                  isAnimationActive={true}
                />
              ))}
            </BarChart> */}
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                tickFormatter={formatCurrency}
                width={80}
                domain={['auto', 'auto']}
                allowDataOverflow={false}
                scale="linear"
              />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              {categories.map((cat, idx) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  fill={COLORS[idx % COLORS.length]}
                  name={cat}
                  isAnimationActive={true}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default YearwiseExpenseChart;