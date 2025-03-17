require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Log environment variables
console.log('API Key from env:', process.env.GEMINI_API_KEY ? 'Found (not showing for security)' : 'Not found');
console.log('All env keys:', Object.keys(process.env));

// Debug: Check if .env file exists
try {
  const envPath = path.join(__dirname, '.env');
  const envExists = fs.existsSync(envPath);
  console.log('.env file exists:', envExists);
  if (envExists) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('.env file content (partial):', envContent.substring(0, 15) + '...');
  }
} catch (error) {
  console.error('Error checking .env file:', error);
}

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// API endpoint to get the Gemini API key from the environment
app.get('/api/key', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    res.json({ key: apiKey });
  } else {
    res.status(404).json({ error: 'API key not found. Make sure to set GEMINI_API_KEY in your .env file' });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});