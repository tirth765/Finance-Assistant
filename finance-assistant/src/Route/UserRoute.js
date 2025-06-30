import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../Container/Home/Home";
import AddExpense from "../Container/Add-Expense/AddExpense";
import AddBudget from "../Container/Add-Budget/AddBudget";
import ManageExpense from "../Container/ManageExpense/ManageExpense";
import DailyExpense from "../Container/DailyExpense/DailyExpense";
import DailyExpenseChart from "../Container/DailyExpenseChart/DailyExpenseChart";
import MonthwiseExpense from "../Container/MonthwiseExpense/MonthwiseExpense";
import MonthwiseExpenseChart from "../Container/MonthwiseExpenseChart/MonthwiseExpenseChart";
import YearwiseExpense from "../Container/YearwiseExpense/YearwiseExpense";
import Profile from "../Container/Profile/Profile";
import ContactUs from "../Container/ContactUs/ContactUs";
import AboutUs from "../Container/AboutUs/AboutUs";
import Login from "../Container/Login/Login";
import Signup from "../Container/Signup/Signup";
import Calendar from "../Container/Calendar/Calender";
import YearwiseExpenseChart from "../Container/YearwiseExpenseChart/YearwiseExpenseChart";
import NotificationReminder from "../Container/NotificationReminder/NotificationReminder";
import NotificationManager from "../Container/Notification Manager/NotificationManager";
import Review from "../Container/Review/Review";
// import MyProfile from "../Container/My-profile/MyProfile";
// import SubCategoryDisplay from "../Container/SubCategory/SubCategoryDisplay";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // You can modify this based on your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function UserRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-expense"
        element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-budget"
        element={
          <ProtectedRoute>
            <AddBudget />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-expense"
        element={
          <ProtectedRoute>
            <ManageExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily-expense"
        element={
          <ProtectedRoute>
            <DailyExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily-expense-chart"
        element={
          <ProtectedRoute>
            <DailyExpenseChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-expense"
        element={
          <ProtectedRoute>
            <MonthwiseExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/yearly-expense"
        element={
          <ProtectedRoute>
            <YearwiseExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-expense-chart"
        element={
          <ProtectedRoute>
            <MonthwiseExpenseChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/yearly-expense-chart"
        element={
          <ProtectedRoute>
            <YearwiseExpenseChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-reminder"
        element={
          <ProtectedRoute>
            <NotificationReminder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-reminders"
        element={
          <ProtectedRoute>
            <NotificationManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedRoute>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
