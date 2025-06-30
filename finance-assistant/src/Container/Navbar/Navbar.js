// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import './Navbar.css';

// const Navbar = () => {
//   const location = useLocation();
//   const isAuthenticated = localStorage.getItem('token'); // Check if user is logged in

//   const isActive = (path) => {
//     return location.pathname === path ? 'active' : '';
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/" className="brand-link">
//           <FontAwesomeIcon icon="fa-solid fa-wallet" className="brand-icon" />
//           <span>Finance Assistant</span>
//         </Link>
//       </div>

//       <div className="navbar-links">
//         {/* Public Links */}
//         <Link to="/" className={`nav-link ${isActive('/')}`}>
//           <FontAwesomeIcon icon="fa-solid fa-house" />
//           <span>Home</span>
//         </Link>
//         <Link to="/contactus" className={`nav-link ${isActive('/contactus')}`}>
//           <FontAwesomeIcon icon="fa-solid fa-envelope" />
//           <span>Contact</span>
//         </Link>

//         {/* Conditional Links based on Authentication */}
//         {isAuthenticated ? (
//           <>
//             <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-user" />
//               <span>Profile</span>
//             </Link>
//             <Link to="/daily-expense" className={`nav-link ${isActive('/daily-expense')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-receipt" />
//               <span>Daily Expense</span>
//             </Link>
//             <Link to="/monthly-expense" className={`nav-link ${isActive('/monthly-expense')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-calendar" />
//               <span>Monthly Expense</span>
//             </Link>
//             <Link to="/yearly-expense" className={`nav-link ${isActive('/yearly-expense')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-calendar-days" />
//               <span>Yearly Expense</span>
//             </Link>
//             <Link to="/daily-expense1" className={`nav-link ${isActive('/daily-expense1')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-chart-line" />
//               <span>Expense Analysis</span>
//             </Link>
//             <button onClick={handleLogout} className="logout-btn">
//               <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
//               <span>Logout</span>
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className={`nav-link ${isActive('/login')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
//               <span>Login</span>
//             </Link>
//             <Link to="/signup" className={`nav-link ${isActive('/signup')}`}>
//               <FontAwesomeIcon icon="fa-solid fa-user-plus" />
//               <span>Sign Up</span>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar; 