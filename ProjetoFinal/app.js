// app.js
const server = require('./server.js'); // Import your existing server.js 

// Start the server 
const port = process.env.PORT || 3000; // Use Render's PORT environment variable 
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});