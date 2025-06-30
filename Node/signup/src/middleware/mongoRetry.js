const mongoose = require('mongoose');

const mongoRetry = async (req, res, next) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Check if connected to cluster0
            if (mongoose.connection.readyState === 1) {
                // Check if connected to the correct cluster
                const db = mongoose.connection.db;
                const adminDb = db.admin();
                const serverStatus = await adminDb.serverStatus();
                
                if (serverStatus.repl && serverStatus.repl.setName === 'cluster0') {
                    return next();
                }
            }

            if (attempt < maxRetries) {
                console.log(`Connection attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        } catch (error) {
            console.error(`Connection attempt ${attempt} failed:`, error);
            if (attempt === maxRetries) {
                return res.status(503).json({
                    success: false,
                    data: null,
                    message: 'Failed to connect to MongoDB Atlas cluster0 after multiple attempts'
                });
            }
        }
    }
};

module.exports = mongoRetry; 