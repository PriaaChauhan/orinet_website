const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Main route: serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexk.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ORINET website running at http://localhost:${PORT}/`);
  if (PORT === 80) {
    console.log('Note: Port 80 may require: sudo node server.js');
  }
});
