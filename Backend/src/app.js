const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

app.use(cors({
    origin: 'https://chatgpt-project-green.vercel.app', // Add https:// prefix
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add supported methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Add allowed headers
}));
app.use(express.json());
app.use(cookieParser());

app.options('*', cors()); // Enable pre-flight for all routes

app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);

module.exports = app;