const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

// CORS configuration for both development and production
app.use(cors({
    origin: [
        'https://chatgpt-project-green.vercel.app',  // Production frontend
        'http://localhost:3000',                     // Development frontend
        'http://localhost:5173'                      // Vite development server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;