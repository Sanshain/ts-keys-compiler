/// tests './test/app.js'


// const ts = require('typescript');
// const { default: keysTransform } = require('../transformer');

import ts from 'typescript';
import { default as keysTransform } from '../sources/transform';


const program = ts.createProgram(['./test/test/global.d.ts', './test/test/app.ts'], {
  strict: true,
  noEmitOnError: true,
  target: ts.ScriptTarget.ES5,
  rootDir: '.'
});

const transformers = {
   before: [keysTransform(
      program,
      {
         // methodName: 'keys'
      })],
  after: []
};
const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, transformers);

if (emitSkipped) {
  throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
}

console.log('ok');
