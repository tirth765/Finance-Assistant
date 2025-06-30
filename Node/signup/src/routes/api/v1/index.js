const express = require('express')
const router = express.Router()
const port = 8000

const signupDataRouter = require('./signupData.routes')
const budgetRouter = require('./budget.routes')
const contactRouter = require('./contact.routes')
const profileRouter = require('./profile.routes')
const reviewRouter = require('./review.routes')

//http://localhost:8000/signupData
router.use('/signupData', signupDataRouter)

// http://localhost:8000/budget
router.use('/budget', budgetRouter)

// http://localhost:8000/contact
router.use('/contact', contactRouter)

// http://localhost:8000/profile
router.use('/profile', profileRouter)

// http://localhost:8000/review
router.use('/review', reviewRouter)

module.exports = router