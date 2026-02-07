const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const app = express();

const HTTPS_PORT = 443;
const HOST = '0.0.0.0';

// Let's Encrypt paths
const SSL_KEY_PATH = '/etc/letsencrypt/live/www.orinetsoftpro.com/privkey.pem';
const SSL_CERT_PATH = '/etc/letsencrypt/live/www.orinetsoftpro.com/fullchain.pem';

// Load SSL files
const httpsOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

// Serve static files
app.use(express.static(path.join(__dirname)));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexk.html'));
});

// Start HTTPS server
https.createServer(httpsOptions, app).listen(HTTPS_PORT, HOST, () => {
  console.log('ORINET website running at https://www.orinetsoftpro.com/');
  console.log('HTTPS only – no HTTP server running');
});
