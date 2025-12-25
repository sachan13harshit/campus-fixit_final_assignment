const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));

app.get('/', (req, res) => {
    res.send('Campus FixIt API is running');
});

// Database Connection
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus-fixit')
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
