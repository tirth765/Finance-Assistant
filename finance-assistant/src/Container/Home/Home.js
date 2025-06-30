import React, { useState, useEffect } from 'react'
import '../../css/Home/Home.css'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets } from '../../redux/Slice/BudgetSlice';


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);
  const [openDropdown, setOpenDropdown] = useState({});

  // State for initialExpenses from database
  const [initialExpenses, setInitialExpenses] = useState([]);

  // Fetch budgets from database when component mounts
  useEffect(() => {
    console.log('Fetching budgets from MongoDB budget collection...');
    dispatch(getBudgets());
  }, [dispatch]);

  // Store the entire budget collection in initialExpenses when budgets are loaded
  useEffect(() => {
    if (budgets && budgets.length > 0) {
      console.log('Received budgets from MongoDB budget collection:', budgets);
      // Store the entire budget collection directly
      setInitialExpenses(budgets);
    } else {
      console.log('No budgets found in MongoDB budget collection');
      setInitialExpenses([]);
    }
  }, [budgets]);

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // State variables
  const [expenses, setExpenses] = useState([]);
  const categories = ['Food', 'Transportation', 'Housing', 'entertainment', 'Utilities', 'Other'];

  // Update expenses when initialExpenses changes
  useEffect(() => {
    // Transform budget data to match expense format for display
    if (initialExpenses && initialExpenses.length > 0) {
      const transformedExpenses = initialExpenses.map(budget => ({
        id: budget._id,
        date: new Date(budget.date).toISOString().split('T')[0],
        category: budget.category,
        amount: budget.amount,
        description: budget.description || 'No description'
      }));
      setExpenses(transformedExpenses);
    } else {
      setExpenses([]);
    }
  }, [initialExpenses]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2);

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear;
    });
  };

  // Calculate total expenses for the current month
  const monthlyExpenses = getCurrentMonthExpenses();
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2);

  const categoryStats = () => {
    const stats = {};

    // Use monthly expenses instead of all expenses
    monthlyExpenses.forEach(expense => {
      const category = expense.category;
      if (!stats[category]) {
        stats[category] = {
          total: 0,
          count: 0
        };
      }
      stats[category].total += parseFloat(expense.amount);
      stats[category].count += 1;
    });

    // Convert to array and sort by total amount (descending)
    return Object.entries(stats)
      .map(([category, data]) => {
        const percentage = totalMonthlyExpenses > 0 ? (data.total / totalMonthlyExpenses) * 100 : 0;
        return {
          category,
          total: data.total,
          count: data.count,
          percentage: Math.round(percentage)
        };
      })
      .sort((a, b) => b.total - a.total); // Sort by total amount in descending order
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#FF6B6B',        // Coral Red
      'Transportation': '#4ECDC4', // Turquoise
      'Housing': '#45B7D1',     // Sky Blue
      'Entertainment': 'rgb(43,194,83)', // Sage Green
      'Utilities': '#6A5ACD',   // Slate Blue
      'Shopping': 'rgb(241,161,101)',    // Gold
      'Other': '#D4A5A5',          // Dusty Rose
    };
    return colors[category] || '#0499a3'; // Default teal color for any unmatched categories
  };

  return (
    <div className='home-body'>
      <nav id='sidebar'>
        <ul>
          <li>
            <span className='logo'>Expense Tracking</span>
            <button id='toggle-btn'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z" /></svg>
            </button>
          </li>
          <li className='active'>
            <Link to="/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li className='active'>
            <div className="relative inline-block text-left">
              <button onClick={() => toggleDropdown("menu1")} className="dropdown-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                  fill="#5f6368">
                  <path
                    d="M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" />
                </svg>
                Create Expense
                {openDropdown["menu1"] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M280-400l200-200 200 200H280Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M480-360 280-560h400L480-360Z" />
                  </svg>
                )}
              </button>
              {openDropdown["menu1"] && (
                <ul className="sub-menu">
                  {/* <li><Link to="/add-expense">Add Expenses</Link></li> */}
                  <li><Link to="/dashboard/add-budget">Add Budget</Link></li>
                  <li><Link to="/dashboard/manage-expense">Manage Expenses</Link></li>
                </ul>
              )}
            </div>
          </li>
          <li className='active'>
            <div className="relative inline-block text-left">
              <button onClick={() => toggleDropdown("menu2")} className="dropdown-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                  fill="#5f6368">
                  <path
                    d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" />
                </svg>
                Expense Tracking
                {openDropdown["menu2"] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M280-400l200-200 200 200H280Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M480-360 280-560h400L480-360Z" />
                  </svg>
                )}
              </button>
              {openDropdown["menu2"] && (
                <ul className="sub-menu">
                  <li><Link to="/dashboard/daily-expense">Daily Expense</Link></li>
                  <li><Link to="/dashboard/monthly-expense">Monthwise Expenses</Link></li>
                  <li><Link to="/dashboard/yearly-expense">Yearwise Expense</Link></li>
                </ul>
              )}
            </div>
          </li>
          <li className='active'>
            <Link to="/dashboard/calendar">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
              </svg>
              <span>Calendar</span>
            </Link>
          </li>
          {/* <li className='active'>
            <Link to="/dashboard/contact">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"/></svg>
              <span>Charts</span>
            </Link>
          </li> */}
          <li className='active'>
            <div className="relative inline-block text-left">
              <button onClick={() => toggleDropdown("menu3")} className="dropdown-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" /></svg>
                Charts
                {openDropdown["menu3"] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M280-400l200-200 200 200H280Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M480-360 280-560h400L480-360Z" />
                  </svg>
                )}
              </button>
              {openDropdown["menu3"] && (
                <ul className="sub-menu">
                  <li><Link to="/dashboard/daily-expense-chart">Daily Expense Chart</Link></li>
                  <li><Link to="/dashboard/monthly-expense-chart">Monthwise Expenses Chart</Link></li>
                  <li><Link to="/dashboard/yearly-expense-chart">Yearwise Expense Chart</Link></li>
                </ul>
              )}
            </div>
          </li>
          <li className='active'>
            <div className="relative inline-block text-left">
              <button onClick={() => toggleDropdown("menu4")} className="dropdown-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>
                Notifications
                {openDropdown["menu4"] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M280-400l200-200 200 200H280Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                    <path d="M480-360 280-560h400L480-360Z" />
                  </svg>
                )}
              </button>
              {openDropdown["menu4"] && (
                <ul className="sub-menu">
                  <li><Link to="/dashboard/add-reminder">Add Notification</Link></li>
                  <li><Link to="/dashboard/manage-reminders">Manage Reminder</Link></li>

                </ul>
              )}
            </div>
          </li>

          <li className='active'>
            <Link to="/dashboard/profile">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
              <span>Profile</span>
            </Link>
          </li>
          <li className='active'>
            <Link to="/dashboard/review">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
              <span>Review</span>
            </Link>
          </li>
          <li className='active'>
            <Link to="/dashboard/contact">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" /></svg>
              <span>ContactUs</span>
            </Link>
          </li>
          <li className='active'>
            <Link to="/dashboard/about">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
              <span>About Us</span>
            </Link>
          </li>
          <li className='active'>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-84 31.5-156.5T197-763l56 56q-44 44-68.5 102T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-67-24.5-125T707-707l56-56q54 54 85.5 126.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v-440h80v440h-80Z" /></svg>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>


      {loading ? (
        <div className="loading">Loading expenses from database...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="home-container">
            <div className="home-container-border">
              <div className="summary-cards">
                <div className="summary-card">
                  <h3 className="card-label">Total Expenses</h3>
                  <p className="card-value">${totalExpenses}</p>
                </div>
                <div className="summary-card">
                  <h3 className="card-label">This Month</h3>
                  <p className="card-value">${totalMonthlyExpenses}</p>
                </div>
                <div className="summary-card">
                  <h3 className="card-label">Average Expense</h3>
                  <p className="card-value">${
                    monthlyExpenses.length > 0
                      ? (parseFloat(totalMonthlyExpenses) / monthlyExpenses.length).toFixed(2)
                      : '0.00'
                  }</p>
                </div>
                <div className="summary-card">
                  <h3 className="card-label">Monthly Entries</h3>
                  <p className="card-value">{monthlyExpenses.length}</p>
                </div>
              </div>
            </div>
            <h2 className="section-title">Monthly Expense Breakdown</h2>
            <div className="category-grid">
              {categoryStats().map((stat, index) => (
                <div key={index} className="category-card">
                  <div className="category-header">
                    <span className="category-name">{stat.category}</span>
                    <span className="category-total">${stat.total.toFixed(2)}</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: getCategoryColor(stat.category)
                      }}
                    />
                  </div>
                  <div className="category-footer">
                    <span className="category-count">{stat.count} transactions</span>
                    <span className="category-percentage">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )
      }
    </div>
  );
};

export default Home;

