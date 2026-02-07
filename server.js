// server.js
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const app = express();

// Ports
const HTTPS_PORT = 443;
const HTTP_PORT = 80;
const HOST = '0.0.0.0';

// Canonical host (change to 'www.orinetsoftpro.com' if you prefer www)
const CANONICAL_HOST = 'orinetsoftpro.com';

// Try a list of Let's Encrypt live dirs (checks which one exists)
const possibleLiveDirs = [
  '/etc/letsencrypt/live/orinetsoftpro.com',
  '/etc/letsencrypt/live/www.orinetsoftpro.com',
  // add more if needed
];

function findCertDir() {
  for (const d of possibleLiveDirs) {
    if (fs.existsSync(d) &&
        fs.existsSync(path.join(d, 'privkey.pem')) &&
        fs.existsSync(path.join(d, 'fullchain.pem'))) {
      return d;
    }
  }
  return null;
}

const certDir = findCertDir();
if (!certDir) {
  console.error('ERROR: No LetsEncrypt cert dir found. Checked:', possibleLiveDirs.join(', '));
  process.exit(1);
}
const SSL_KEY_PATH = path.join(certDir, 'privkey.pem');
const SSL_CERT_PATH = path.join(certDir, 'fullchain.pem');

// Load SSL files (synchronous on startup)
const httpsOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
  // Optional: add ca if you have it
  // ca: fs.readFileSync(path.join(certDir,'chain.pem')),
};

// Optional: auto-reload certs when they change (lightweight)
fs.watch(certDir, (ev, filename) => {
  if (['privkey.pem','fullchain.pem','chain.pem'].includes(filename)) {
    try {
      httpsOptions.key = fs.readFileSync(SSL_KEY_PATH);
      httpsOptions.cert = fs.readFileSync(SSL_CERT_PATH);
      console.log('Reloaded SSL certs from', certDir);
      // Note: this won't replace the running server's credentials automatically for
      // all implementations. For full reload you might recreate the server or use SNI.
    } catch (e) {
      console.warn('Failed to reload certs:', e && e.message);
    }
  }
});

// If behind a proxy (e.g., Apache), trust the proxy headers for req.hostname and protocol
app.set('trust proxy', true);

// Serve static files from current directory (same as your code)
app.use(express.static(path.join(__dirname)));

// Canonicalization middleware: redirect to canonical host (preserve path and query)
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  if (host && host !== CANONICAL_HOST) {
    // Keep original protocol if using reverse proxy with X-Forwarded-Proto
    const proto = (req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http'));
    const dest = `${proto}://${CANONICAL_HOST}${req.originalUrl}`;
    return res.redirect(301, dest);
  }
  next();
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexk.html'));
});

// Start HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(HTTPS_PORT, HOST, () => {
  console.log(`HTTPS server listening on https://${CANONICAL_HOST}:${HTTPS_PORT}`);
});

// Start HTTP server to redirect everything to HTTPS (preserve path + query)
const redirectApp = express();
redirectApp.use((req, res) => {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  // Redirect to canonical host over https
  const dest = `https://${CANONICAL_HOST}${req.originalUrl}`;
  res.redirect(301, dest);
});
http.createServer(redirectApp).listen(HTTP_PORT, HOST, () => {
  console.log(`HTTP redirect server listening on http://0.0.0.0:${HTTP_PORT} -> https://${CANONICAL_HOST}`);
});
