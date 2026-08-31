const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Pipeline (Module 3)
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'DevCollab REST API is Active and Running',
    version: '1.0.0 (Phase-1 Scaffolding)'
  });
});

// Centralized Error Handler (Module 3 Slide 22)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DevCollab Server running on http://localhost:${PORT}`);
});
