// server.js
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); // For handling file uploads
const fs = require('fs'); // For file system operations

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Save uploaded files to 'public/uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp to filename
  },
});
const upload = multer({ storage });

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

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

// Upload image route
app.post('/upload', upload.single('imageUpload'), (req, res) => {
  if (req.file) {
    res.send({ message: 'Image uploaded successfully!', fileName: req.file.filename });
  } else {
    res.send({ message: 'Error uploading image' });
  }
});

// Create album route
app.post('/createAlbum', (req, res) => {
  const albumTitle = req.body.albumTitle;
  const albumDescription = req.body.albumDescription;

  // Create a new album directory 
  const albumDirectory = path.join(__dirname, 'public', 'albums', albumTitle); 
  fs.mkdirSync(albumDirectory, { recursive: true });

  // Optionally, save album data to a file or database
  // Example:
  // fs.writeFileSync(path.join(albumDirectory, 'album.json'), JSON.stringify({ title: albumTitle, description: albumDescription }));

  res.send({ message: 'Album created successfully!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});