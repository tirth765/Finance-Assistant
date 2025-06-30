const SignupData = require('../model/signupData.model.js');
const Profile = require('../model/profile.model.js');
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const generate_user = async (userID) => {
    const user = await SignupData.findById(userID);
  
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
  
    const refreshToken = jwt.sign(
      {
        _id: user._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
  
    user.refreshToken = refreshToken;
  
    await user.save({ validateBeforeSave: false });
  
    return { accessToken, refreshToken };
  };
  
  const registerUser = async (req, res) => {
    try {
      const { name, email, password, role, phone, dateOfBirth } = req.body;
  
      console.log('Registration attempt:', { email, name, role, phone, dateOfBirth });
  
      // Validate required fields
      if (!email || !password || !name || !phone || !dateOfBirth) {
        console.log('Missing required fields:', { email, name, phone, dateOfBirth });
        return res.status(400).json({
          success: false,
          data: [],
          message: "All fields are required",
        });
      }

      // Validate password confirmation
      if (password !== req.body.confirmPassword) {
        console.log('Password mismatch');
        return res.status(400).json({
          success: false,
          data: [],
          message: "Passwords do not match",
        });
      }

      // Check if user already exists
      const existingUser = await SignupData.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({
          success: false,
          data: [],
          message: "User already exists with this email"
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');

      // Validate date format
      const parsedDate = new Date(dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        console.log('Invalid date format:', dateOfBirth);
        return res.status(400).json({
          success: false,
          data: [],
          message: "Invalid date format for date of birth",
        });
      }
  
      // Create user object
      const userData = {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        phone,
        dateOfBirth: parsedDate
      };

      console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
  
      const newUser = await SignupData.create(userData);
      console.log('User created successfully:', newUser._id);
  
      // Create initial profile for the user
      await Profile.create({
        userId: newUser._id,
        phoneNumber: phone,
        dateOfBirth: dateOfBirth,
        preferences: {
          currency: 'USD',
          language: 'en',
          notifications: {
            email: true,
            push: true
          }
        }
      });
  
      // Generate tokens
      const { accessToken, refreshToken } = await generate_user(newUser._id);
      console.log('Tokens generated successfully');
  
      // Update user with refresh token
      newUser.refreshToken = refreshToken;
      await newUser.save();
  
      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: accessToken,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        console.log('Validation error:', messages);
        return res.status(400).json({
          success: false,
          data: [],
          message: messages.join(', ')
        });
      }
      
      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        console.log('Duplicate key error:', error.keyValue);
        return res.status(400).json({
          success: false,
          data: [],
          message: `${Object.keys(error.keyValue)[0]} already exists`
        });
      }

      return res.status(500).json({
        success: false,
        data: [],
        message: "Server error: " + error.message,
      });
    }
  };
  
  const user_login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      console.log('Login attempt for email:', email);
  
      // Validate required fields
      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({
          success: false,
          data: null,
          message: "Email and password are required",
        });
      }
  
      // Find user by email
      const user = await SignupData.findOne({ email: email });
  
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid email or password",
        });
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({
          success: false,
          data: null,
          message: "Invalid email or password",
        });
      }
  
      // Generate tokens
      const { accessToken, refreshToken } = await generate_user(user._id);
      console.log('Tokens generated successfully for user:', email);
  
      // Get user data without sensitive information
      const userData = await SignupData.findById(user._id).select("-password -refreshToken");
  
      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      return res.status(200).json({
        success: true,
        data: userData,
        token: accessToken,
        message: "Login successful",
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        data: null,
        message: "Server error: " + error.message,
      });
    }
  };
  
  const generateNewTokens = async (req, res) => {
    try {
      console.log(
        req.cookies.refreshToken,
        req.headers.authorization.replace("Bearer ", "")
      );
  
      const token =
        req.cookies.refreshToken ||
        req.headers.authorization.replace("Bearer ", "");
  
      if (!token) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "token not found",
        });
      }
  
      try {
        const varifyTocken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
        console.log(varifyTocken._id);
  
        if (!varifyTocken) {
          return res.status(400).json({
            success: false,
            data: [],
            message: "token not verify",
          });
        }
  
        const user = await SignupData.findById(varifyTocken._id);
        console.log(user);
  
        if (user.refreshToken !== token) {
          return res.status(400).json({
            success: false,
            data: [],
            message: "invalid user token",
          });
        }
  
        const options = {
          httpOnly: true,
          secure: true,
        };
  
        const { accessToken, refreshToken } = await generate_user(user._id);
  
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json({
            success: true,
            data: user,
            message: "Token created successfully",
          });
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: [],
          message: "Error in server: " + error.message,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: [],
        message: "Error in server: " + error.message,
      });
    }
  };
  
  const user_logout = async (req, res) => {
    try {
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Refresh token is required",
        });
      }
  
      // Find user by refresh token
      const user = await SignupData.findOne({ refreshToken: refreshToken });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Invalid refresh token",
        });
      }
  
      // Clear refresh token
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
          success: true,
          data: [],
          message: "Logged out successfully",
        });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        data: [],
        message: "Server error: " + error.message,
      });
    }
  };

  const forgotPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      console.log('Forgot password attempt for email:', email);
  
      // Validate required fields
      if (!email || !newPassword) {
        console.log('Missing email or new password');
        return res.status(400).json({
          success: false,
          message: "Email and new password are required",
        });
      }
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Invalid email format:', email);
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }
  
      // Validate password length
      if (newPassword.length < 6) {
        console.log('Password too short');
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
  
      // Find user by email
      const user = await SignupData.findOne({ email: email });
  
      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({
          success: false,
          message: "Email not found in our database",
        });
      }
  
      // Hash the new password
      const hashPassword = await bcrypt.hash(newPassword, 10);
      console.log('New password hashed successfully');
  
      // Update user's password
      user.password = hashPassword;
      await user.save({ validateBeforeSave: false });
      console.log('Password updated successfully for user:', email);
  
      return res.status(200).json({
        success: true,
        message: "Password reset successfully! You can now login with your new password.",
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  };

module.exports = {
    registerUser,
    user_login,
    generateNewTokens,
    user_logout,
    forgotPassword,
};