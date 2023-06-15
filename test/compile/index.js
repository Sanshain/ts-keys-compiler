const { compile } = require('./compile');
const path = require('path');

compile(['../index.ts', '..//test/global.d.ts'].map(relpath => path.join(__dirname, relpath)));
