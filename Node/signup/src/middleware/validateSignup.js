const validateSignup = (req, res, next) => {
    const { name, email, password, confirmPassword, role } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'All fields are required'
        });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Invalid email format'
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Password must be at least 6 characters long'
        });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Passwords do not match'
        });
    }

    // If all validations pass, proceed to the next middleware
    next();
};

module.exports = validateSignup; 