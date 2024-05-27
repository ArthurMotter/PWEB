const express = require('express');
const app = express();
const path = require('path'); // For handling file paths

// Set up static file serving
app.use(express.static(path.join(__dirname, 'pages')));

// Define a route for your home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});