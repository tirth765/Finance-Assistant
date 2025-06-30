const mongoose = require('mongoose');

const mongoMonitor = (req, res, next) => {
    const connectionState = mongoose.connection.readyState;
    
    // Connection states:
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    
    if (connectionState !== 1) {
        return res.status(503).json({
            success: false,
            data: null,
            message: 'Database connection is not ready. Current state: ' + 
                (connectionState === 0 ? 'Disconnected' :
                 connectionState === 2 ? 'Connecting' :
                 connectionState === 3 ? 'Disconnecting' : 'Unknown')
        });
    }
    
    next();
};

module.exports = mongoMonitor; 