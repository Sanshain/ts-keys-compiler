//@ts-check

import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import keysTransform from 'ts-keys-compiler/dist';


const release = true

export default {
   input: './index.ts',
   output: {
      file: 'index.js',
      format: 'iife'
   },
   plugins: [
      resolve(),
      typescript({
         transformers: release ? [service => {
            const program = service.getProgram()
            return {
               before: program ? [keysTransform(program)] : [],
               after: []
            }
         }] : []
      })
   ]
};
