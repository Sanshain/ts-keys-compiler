//@ts-check

const keysTransformer = require('../../dist/index').default;
var uppercaseStringLiteralTransformer = require('./transformer').default;

module.exports = [
   'ts-loader',
   'awesome-typescript-loader'
].map(loader => ({
   mode: 'development',
   entry: './index.ts',
   output: {
      filename: `build/bundle-${loader}.js`,
      path: __dirname
   },
   resolve: {
      extensions: ['.ts', '.js']
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            loader,
            options: {
               getCustomTransformers: program => ({
                  before: [
                     // uppercaseStringLiteralTransformer,
                     keysTransformer(program)
                  ]
               }),
            }
         }
      ]
   }
}));
