const express = require("express");
const signupDataController = require("../../../controller/signupData.controller");
const validateSignup = require("../../../middleware/validateSignup");

const user = express.Router()

//http://localhost:8000/api/v1/signupData/register
user.post(
    '/register',
    validateSignup,
    signupDataController.registerUser
)
//http://localhost:8000/api/v1/signupData/login
user.post(
    '/login',
    signupDataController.user_login
)
//http://localhost:8000/api/v1/signupData/generateNewTokens
user.get(
    '/generateNewTokens',
    signupDataController.generateNewTokens
)
//http://localhost:8000/api/v1/signupData/logout
user.post(
    '/logout',
    signupDataController.user_logout
)
//http://localhost:8000/api/v1/signupData/forgot-password
user.post(
    '/forgot-password',
    signupDataController.forgotPassword
)
 
module.exports = user