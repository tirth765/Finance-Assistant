import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import '../../css/Signup/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let color = '';

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Set message and color based on score
    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak';
        color = '#ff4444';
        break;
      case 2:
        message = 'Weak';
        color = '#ffbb33';
        break;
      case 3:
        message = 'Medium';
        color = '#00C851';
        break;
      case 4:
        message = 'Strong';
        color = '#007E33';
        break;
      default:
        message = 'Very Strong';
        color = '#007E33';
    }

    setPasswordStrength({ score, message, color });
  };

  const validateForm = () => {
    const errors = [];

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required');
    } else if (formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (passwordStrength.score < 3) {
      errors.push('Password is too weak. Please make it stronger');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // Phone validation (optional)
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 13) {
        errors.push('You must be at least 13 years old');
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/signupData/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'user',
        phone: formData.phone || '0000000000', // Default value if not provided
        dateOfBirth: formData.dateOfBirth || new Date().toISOString() // Default value if not provided
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        withCredentials: true
      });

      if (response.data.success) {
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 500);
      } else {
        setError(response.data.message || 'Error creating account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        setError(err.response.data.message || 'Error creating account. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="social-login">
          <button 
          onClick={() => handleSocialLogin('google')}
           className="social-btn google">
            <FaGoogle /> Continue with Google
          </button>
          <button 
          onClick={() => handleSocialLogin('github')} 
          className="social-btn github">
            <FaGithub /> Continue with GitHub
          </button>
          <button 
          onClick={() => handleSocialLogin('facebook')} 
          className="social-btn facebook">
            <FaFacebook /> Continue with Facebook
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form 
         onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth (Optional)</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formData.password && (
               <div className="password-strength" style={{ color: passwordStrength.color }}> 
                Strength: {passwordStrength.message} 
               </div>
             )} 
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                 onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="signup-button" 
          disabled={loading}
          >
              {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup; 