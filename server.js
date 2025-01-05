const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Read proxy config
const proxyConfig = require('./proxy.conf.json');

// Setup proxy middleware
Object.keys(proxyConfig).forEach(path => {
    const config = proxyConfig[path];
    app.use(path, createProxyMiddleware({
        target: config.target,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
    }));
});

// Serve static files from dist/demo/browser directory
app.use(express.static(path.join(__dirname, 'dist/demo/browser')));

// All other routes should return the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/demo/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from: ${path.join(__dirname, 'dist/demo/browser')}`);
});