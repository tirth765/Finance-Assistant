const express = require("express");
const profileController = require("../../../controller/profile.controller");
const auth = require("../../../middleware/auth");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../../uploads/profile-pictures');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const router = express.Router();

// http://localhost:8000/api/v1/profile/create  
router.post('/create', auth(), upload.single('avatar'), profileController.createProfile);

// http://localhost:8000/api/v1/profile/me
router.get('/me', auth(), profileController.getProfile);

// http://localhost:8000/api/v1/profile/update
router.put('/update', auth(), upload.single('avatar'), profileController.updateProfile);

// http://localhost:8000/api/v1/profile/preferences
router.put('/preferences', auth(), profileController.updatePreferences);

module.exports = router;