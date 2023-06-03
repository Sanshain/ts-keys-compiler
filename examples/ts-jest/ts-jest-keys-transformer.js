const keysTransformer = require('ts-keys-compiler/dist').default;
const name = 'my-key-transformer';
const version = 1;
const factory = (cs) => (ctx) => keysTransformer(cs.program)(ctx);
module.exports = { name, version, factory };