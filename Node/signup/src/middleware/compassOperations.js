const mongoose = require('mongoose');

const compassOperations = async (req, res, next) => {
    try {
        const db = mongoose.connection.db;
        
        // Check if database is accessible (similar to Compass connection check)
        const collections = await db.listCollections().toArray();
        
        // Add Compass-specific information to request
        req.compassInfo = {
            databaseName: db.databaseName,
            collectionCount: collections.length,
            collections: collections.map(col => col.name),
            isConnected: mongoose.connection.readyState === 1
        };

        // Log Compass-like information
        console.log('MongoDB Compass Info:', {
            database: db.databaseName,
            collections: collections.map(col => col.name),
            connectionStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
        });

        next();
    } catch (error) {
        console.error('Compass operations error:', error);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Error performing Compass operations'
        });
    }
};

module.exports = compassOperations; 