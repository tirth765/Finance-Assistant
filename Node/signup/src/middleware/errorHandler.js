const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            data: null,
            message: Object.values(err.errors).map(error => error.message).join(', ')
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Duplicate field value entered'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            data: null,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            data: null,
            message: 'Token expired'
        });
    }

    // Default error
    return res.status(err.statusCode || 500).json({
        success: false,
        data: null,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler; 