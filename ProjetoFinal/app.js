// app.js
const express = require('express');
const app = express();
const server = require('./server.js'); // Import server.js
const port = process.env.PORT || 3000;

// Use the routes defined in server.js 
app.use(server); 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});