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

// Delete photo route
app.delete('/deletePhoto/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', 'uploads', fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting photo' });
    } else {
      res.json({ message: 'Photo deleted successfully' });
    }
  });
});

// Fetch images route
app.get('/fetchImages', (req, res) => {
  const uploadsDirectory = path.join(__dirname, 'public', 'uploads');
  const imagesFile = path.join(__dirname, 'public', 'images.json');
  let images = [];
  try {
    images = JSON.parse(fs.readFileSync(imagesFile)); 
  } catch (error) {
    // Handle the case where the file doesn't exist
    console.error("Error reading images.json:", error);
  }
  fs.readdir(uploadsDirectory, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Error reading images' });
    } else {
      const updatedImages = files.map((file, index) => {
        // Add filename to the existing images array if it's not already present
        if (!images.some(image => image.fileName === file)) {
          images.push({
            fileName: file,
            uploadDate: new Date().toLocaleDateString() // Update with real upload date if needed
          });
        }
        return {
          fileName: file,
          uploadDate: images[index] ? images[index].uploadDate : new Date().toLocaleDateString()
        };
      });
      fs.writeFileSync(imagesFile, JSON.stringify(updatedImages)); // Update the file
      res.json(updatedImages);
    }
  });
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