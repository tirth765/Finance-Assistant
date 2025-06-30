require('dotenv').config()
const express = require('express')
const route = require('./routes/api/v1')
const connectDB = require('./DB/mongoDB')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
app.use(express.json())
const port = 8000

app.use('/public', express.static('public'))
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

connectDB()
app.use('/api/v1', route)

app.listen(8000, () => {
  console.log(`Server running on port ${port}`)
})


