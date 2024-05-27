const express = require('express');
const app = express();
const path = require('path'); // For handling file paths

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for your home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

// ... (server.js)

// Route for a "menu" page
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/menu.html'));
});
// Route for a "edit" page
app.get('/edit_file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/edit_file.html'));
});
// Route for a "create" page
app.get('/create_album', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/create_album.html'));
});
// Route for a "view" page
app.get('/view_file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/view_file.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});