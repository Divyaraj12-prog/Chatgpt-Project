const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');


const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

app.use(cors({
    origin: 'chatgpt-project-green.vercel.app',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);

module.exports = app;