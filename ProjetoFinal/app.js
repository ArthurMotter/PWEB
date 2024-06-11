// app.js
const express = require('express');
const server = require('./server.js'); 
const port = process.env.PORT || 3000;

// Create a new Express app instance
const app = express(); 

// Use the routes from server.js
app.use(server); 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});