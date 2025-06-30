import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../Container/Login/Login";
import Signup from "../Container/Signup/Signup";
import ContactUs from "../Container/ContactUs/ContactUs";

export default function PublicRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}
