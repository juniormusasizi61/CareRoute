const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
// Keep middleware registration centralized at startup.
app.use(cors());
app.use(express.json());

// Basic health endpoint used by Docker and local smoke tests.
app.get('/', (req, res) => {
  res.send('CareRoute backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
