const Contact = require('../model/contact.model.js');

const submitContact = async (req, res) => {
    try {
        // Validate required fields
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        // Create contact entry
        const contact = await Contact.create(req.body);

        return res.status(201).json({
            success: true,
            data: contact,
            message: "Contact form submitted successfully"
        });
    } catch (error) {
        console.error("Contact submission error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Error in server: " + error.message
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: contacts,
            message: "Contacts retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Contact not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: contact,
            message: "Contact status updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Contact not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: "Contact deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error in server: " + error.message
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    updateContactStatus,
    deleteContact
}; 