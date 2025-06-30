import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/Login/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotResponse, setForgotResponse] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotForm(prev => ({ ...prev, [name]: value }));
    if (forgotResponse) setForgotResponse('');
  };

  const validateForm = () => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) errors.push('Email is required');
    else if (!emailRegex.test(formData.email)) errors.push('Enter a valid email');

    if (!formData.password) errors.push('Password is required');
    else if (formData.password.length < 6) errors.push('Password must be at least 6 characters');

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    return true;
  };

  const validateForgotForm = () => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!forgotForm.email) errors.push('Email is required');
    else if (!emailRegex.test(forgotForm.email)) errors.push('Enter a valid email');

    if (!forgotForm.newPassword) errors.push('New password is required');
    else if (forgotForm.newPassword.length < 6) errors.push('Password must be at least 6 characters');

    if (!forgotForm.confirmPassword) errors.push('Please confirm your password');
    else if (forgotForm.newPassword !== forgotForm.confirmPassword) errors.push('Passwords do not match');

    if (errors.length > 0) {
      setForgotResponse(errors.join('\n'));
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
      const response = await axios.post('http://localhost:8000/api/v1/signupData/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message || 'Invalid credentials');
      else setError('Network error or server down.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotResponse('');
    setForgotLoading(true);

    if (!validateForgotForm()) {
      setForgotLoading(false);
      return;
    }

    try {
      console.log('Sending forgot password request:', {
        email: forgotForm.email,
        newPassword: forgotForm.newPassword
      });

      const response = await axios.post('http://localhost:8000/api/v1/signupData/forgot-password', {
        email: forgotForm.email,
        newPassword: forgotForm.newPassword
      });

      console.log('Forgot password response:', response.data);

      if (response.data.success) {
        setForgotResponse('Password reset successfully! You can now login with your new password.');
        setForgotForm({ email: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowForgot(false), 3000);
      } else {
        setForgotResponse(response.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Forgot password error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      if (err.response) {
        setForgotResponse(err.response.data.message || 'Failed to reset password.');
      } else if (err.request) {
        setForgotResponse('Network error. Please check if the server is running.');
      } else {
        setForgotResponse('Network error. Please try again.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgot(false);
    setForgotForm({ email: '', newPassword: '', confirmPassword: '' });
    setForgotResponse('');
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="header">
              <h1>Login</h1>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <span onClick={() => navigate('/signup')} className="signup-link">
                Sign up
              </span>
            </p>
            <p>
              <span onClick={() => setShowForgot(true)} className="forgot-link">
                Forgot Password?
              </span>
            </p>
          </div>
        </form>

        {showForgot && (
          <div className="forgot-modal">
            <div className="forgot-card">
              <div className="forgot-header">
                <h2>Reset Password</h2>
                <button className="close-btn" onClick={closeForgotModal}>×</button>
              </div>
              
              <div className="forgot-form">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={forgotForm.email}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={forgotForm.newPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={forgotForm.confirmPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  disabled={forgotLoading}
                  className="reset-btn"
                >
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
                
                {forgotResponse && (
                  <div className={`forgot-response ${forgotResponse.includes('successfully') ? 'success' : 'error'}`}>
                    {forgotResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
