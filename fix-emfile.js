// This file patches Node.js fs module with graceful-fs
// to handle EMFILE errors gracefully
const fs = require('fs');
const gracefulFs = require('graceful-fs');

// Patch the global fs module
gracefulFs.gracefulify(fs);

console.log('Applied graceful-fs patch to handle EMFILE errors'); 