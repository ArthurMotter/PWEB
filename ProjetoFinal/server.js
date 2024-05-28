const express = require('express');
const app = express();
const path = require('path'); // For handling file paths

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for your pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'menu.html')); 
});

app.get('/edit_file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'edit_file.html'));
});

app.get('/create_album', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'create_album.html'));
});

app.get('/view_file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'view_file.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});