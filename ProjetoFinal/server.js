// server.js
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); // For handling file uploads
const fs = require('fs'); // For file system operations

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/data/uploads'); // Save uploaded files to 'public/uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp to filename
  },
});
const upload = multer({ storage });

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'data', 'uploads'))); // This line serves static files

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (res) => {
  console.log("Root route accessed"); 
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

// Export the Express app
module.exports = app;
/*
// Define routes for your pages
app.get('/', (res) => { // Remove 'req'
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});
/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'menu.html')); 
});

app.get('/edit_file', (req, res) => {
  const imageName = req.query.image;
  res.sendFile(path.join(__dirname, 'public', 'pages', 'edit_file.html'));
});

app.get('/fetchImageMetadata/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const imagesFile = path.join(__dirname, 'public', 'data', 'images.json');
  let images = [];
  try {
    images = JSON.parse(fs.readFileSync(imagesFile));
  } catch (error) {
    console.error("Error reading images.json:", error);
  }

  const imageData = images.find(image => image.fileName === fileName);

  if (imageData) {
    res.json(imageData);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Delete photo route
app.delete('/deletePhoto/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', 'data', 'uploads', fileName);

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
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
  let albums = [];

  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
    return res.status(500).json({ error: 'Error reading albums.json' });
  }

  // Find the index of the album to delete
  const albumIndex = albums.findIndex(album => album.albumName === albumName);

  // If album is found
  if (albumIndex !== -1) {
    albums.splice(albumIndex, 1); // Remove the album from the array

    try {
      fs.writeFileSync(albumsFile, JSON.stringify(albums)); // Update the file
      res.json({ message: `Album "${albumName}" deleted successfully` });
    } catch (error) {
      console.error("Error writing albums.json:", error);
      res.status(500).json({ error: 'Error deleting album' });
    }
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
});

// Fetch images route
app.get('/fetchImages', (req, res) => {
  const uploadsDirectory = path.join(__dirname, 'public', 'data', 'uploads');
  const imagesFile = path.join(__dirname, 'public', 'data', 'images.json');
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
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
  let albums = [];
  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
  }

  res.json(albums); // Send the albums data to the client
});

// Fetch album images route
app.get('/fetchAlbumImages', (req, res) => {
  const albumId = req.query.albumId;
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
  let albums = [];

  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
    return res.status(500).json({ error: 'Error reading albums.json' });
  }

  const album = albums.find(album => album.albumId == albumId); // Note: albumId is a string in the query

  if (album) {
    res.json(album.albumImages);
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
});

// Handle the cropped image upload
app.post('/cropImage', upload.single('croppedImage'), (req, res) => {
  if (req.file) {
    res.send({ message: 'Cropped image uploaded successfully!' });
  } else {
    res.send({ message: 'Error uploading cropped image' });
  }
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
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
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

// Update Album route
app.put('/editAlbum/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  const { albumName, albumDescription, albumImages } = req.body;
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
  let albums = [];

  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
    return res.status(500).json({ error: 'Error reading albums.json' });
  }

  const albumIndex = albums.findIndex(album => album.albumId == albumId);

  if (albumIndex !== -1) {
    albums[albumIndex].albumName = albumName;
    albums[albumIndex].albumDescription = albumDescription;

    // 1. Get filenames of images to KEEP (those NOT from the dropdown)
    //    (This part needs to be adjusted based on how your client-side 
    //     code handles adding/removing images in the albumImagesContainer)
    const imagesToKeep = req.body.imagesToKeep; // Assuming the client sends this data 

    // 2. Filter the existing album images 
    albums[albumIndex].albumImages = albums[albumIndex].albumImages.filter(img =>
      imagesToKeep.includes(img)
    );

    // 3. Add new images from the dropdown 
    albums[albumIndex].albumImages = [
      ...albums[albumIndex].albumImages, // Images to keep
      ...albumImages,                  // New images from the dropdown
    ];

    try {
      fs.writeFileSync(albumsFile, JSON.stringify(albums));
      res.json({ message: 'Album updated successfully', albumName, albumDescription });
    } catch (error) {
      console.error("Error writing albums.json:", error);
      res.status(500).json({ error: 'Error updating album' });
    }
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
});

// Fetch album details
app.get('/fetchAlbum', (req, res) => {
  const albumId = req.query.albumId;
  const albumsFile = path.join(__dirname, 'public', 'data', 'albums.json');
  let albums = [];
  try {
    albums = JSON.parse(fs.readFileSync(albumsFile));
  } catch (error) {
    console.error("Error reading albums.json:", error);
    return res.status(500).json({ error: 'Error reading albums.json' });
  }

  const album = albums.find(album => album.albumId == albumId);

  if (album) {
    res.json(album);
  } else {
    res.status(404).json({ error: 'Album not found' });
  }
});
*/