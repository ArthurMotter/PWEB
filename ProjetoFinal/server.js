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

// Delete album route
app.delete('/deleteAlbum/:albumName', (req, res) => {
  const albumName = req.params.albumName;
  const albumsFile = path.join(__dirname, 'public', 'albums.json');
  let albums = [];
  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
  }

  albums = albums.filter(album => album.albumName !== albumName); // Remove the album from the array

  fs.writeFileSync(albumsFile, JSON.stringify(albums));

  res.json({ message: `Album "${albumName}" deleted successfully` });
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

// Fetch albums route
app.get('/fetchAlbums', (req, res) => {
  const albumsFile = path.join(__dirname, 'public', 'albums.json');
  let albums = [];
  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
  }

  res.json(albums); // Send the albums data to the client
});

// Upload image route
app.post('/upload', upload.single('imageUpload'), (req, res) => {
  if (req.file) {
    res.send({ message: 'Image uploaded successfully!', fileName: req.file.filename });
  } else {
    res.send({ message: 'Error uploading image' });
  }
});

// Create Album route
app.post('/createAlbum', (req, res) => {
  const { albumName, albumDescription, albumImages, creationDate } = req.body;
  const albumsFile = path.join(__dirname, 'public', 'albums.json');
  let albums = [];
  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
  }

  albums.push({
    albumName,
    albumDescription,
    albumImages,
    creationDate,
    albumId: Date.now() // Add a unique identifier (timestamp-based)
  });

  fs.writeFileSync(albumsFile, JSON.stringify(albums));

  res.json({ message: `Album "${albumName}" created successfully`, albumId: Date.now() });
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});