const SignupData = require('../model/signupData.model.js');
const jwt = require("jsonwebtoken");

const auth = () => async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "No token provided. Please login first.",
            });
        }

        // Extract token without 'Bearer '
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "Invalid token format",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            // Find user
            const user = await SignupData.findById(decoded._id).select('-password -refreshToken');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "User not found",
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    data: null,
                    message: "Invalid token",
                });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    data: null,
                    message: "Token has expired",
                });
            }
            throw err;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Server error: " + error.message,
        });
    }
};

module.exports = auth;