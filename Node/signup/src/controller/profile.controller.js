const Profile = require('../model/profile.model.js');
const SignupData = require('../model/signupData.model.js');
const fs = require('fs');
const path = require('path');

const createProfile = async (req, res) => {
    try {
        const existingProfile = await Profile.findOne({ userId: req.user._id });
        
        if (existingProfile) {
            // Remove uploaded file if profile creation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                data: null,
                message: "Profile already exists for this user"
            });
        }

        let profileData = { ...req.body };
        if (req.file) {
            profileData.avatar = req.file.filename;
        }

        const profile = await Profile.create({
            ...profileData,
            userId: req.user._id
        });

        return res.status(201).json({
            success: true,
            data: profile,
            message: "Profile created successfully"
        });
    } catch (error) {
        // Remove uploaded file if profile creation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            data: null,
            message: "Error in server: " + error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        // First, get the user's basic information
        const user = await SignupData.findById(req.user._id).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "User not found"
            });
        }

        // Get the profile information
        let profile = await Profile.findOne({ userId: req.user._id });

        // If profile doesn't exist, create a default one
        if (!profile) {
            profile = await Profile.create({
                userId: req.user._id,
                phoneNumber: user.phone,
                dateOfBirth: user.dateOfBirth,
                preferences: {
                    currency: 'USD',
                    language: 'en',
                    notifications: {
                        email: true,
                        push: true
                    }
                }
            });
        }

        // Combine user and profile data
        const combinedData = {
            ...user.toObject(),
            ...profile.toObject(),
            // Ensure these fields are properly mapped
            phone: user.phone || profile.phoneNumber,
            dateOfBirth: user.dateOfBirth || profile.dateOfBirth
        };

        return res.status(200).json({
            success: true,
            data: combinedData,
            message: "Profile retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Error in server: " + error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });
        let updateData = { ...req.body };

        // Handle file upload
        if (req.file) {
            // Delete old avatar file if it exists
            if (profile && profile.avatar) {
                const oldAvatarPath = path.join('uploads/profile-pictures', profile.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }
            updateData.avatar = req.file.filename;
        }

        // If profile doesn't exist, create it
        if (!profile) {
            profile = await Profile.create({
                ...updateData,
                userId: req.user._id
            });
        } else {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { userId: req.user._id },
                updateData,
                { new: true }
            );
        }

        // Also update relevant fields in the user document
        await SignupData.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            phone: req.body.phone || req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth
        });

        return res.status(200).json({
            success: true,
            data: profile,
            message: "Profile updated successfully"
        });
    } catch (error) {
        // Remove uploaded file if update fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            data: null,
            message: "Error in server: " + error.message
        });
    }
};

const updatePreferences = async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            profile = await Profile.create({
                userId: req.user._id,
                preferences: req.body
            });
        } else {
            profile = await Profile.findOneAndUpdate(
                { userId: req.user._id },
                { preferences: req.body },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            data: profile,
            message: "Preferences updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Error in server: " + error.message
        });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    updatePreferences
}; 