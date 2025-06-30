const express = require("express");
const contactController = require("../../../controller/contact.controller");
const auth = require("../../../middleware/auth");

const router = express.Router();

// Protected route - authentication required
// http://localhost:8000/api/v1/contact/submit
router.post('/submit', auth, contactController.submitContact);

// Admin routes - authentication required
// http://localhost:8000/api/v1/contact/list
router.get('/list', auth, contactController.getAllContacts);

// http://localhost:8000/api/v1/contact/:id/status
router.put('/:id/status', auth, contactController.updateContactStatus);

// http://localhost:8000/api/v1/contact/:id
router.delete('/:id', auth, contactController.deleteContact);

module.exports = router; 