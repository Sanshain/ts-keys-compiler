# ts-keys-compiler
A TypeScript custom transformer which enables to obtain keys of given type.

![Build Status](https://github.com/kimamula/ts-transformer-keys/workflows/test/badge.svg)
[![Downloads](https://img.shields.io/npm/dm/ts-transformer-keys.svg)](https://www.npmjs.com/package/ts-transformer-keys)


## Requirement
TypeScript >= 2.4.1

# Motivation

`Object.keys` and `Object.getOwnPropertyNames` methods return `string[]` type instead of `(keyof obj)[]` expected by the naming. The reason why this is done this way is that the types of objects in typescript are covariant and may implicitly contain supersets of other types. And therefore, they can lead to the fact that in runtime when calling `Object.keys` we can get as a result keys that are not covered by typescript types. For example consider [this one](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgPICMBWEFgMID2IAzmFAK64FTIDeAUMk8gPQBUbjzybyAShDDkoJZGAAWKEHAC2EYsgIwxk5BBDk5UOOgA2KUlFABzZAAcoBM9DDB5yOCAAmyORIJOFShyEVYcYAB0XMy8AAJmcNoyimj+uCpwYMgIRGBwoAoSKBZWNnYKji5u4h7EgcgAKuLACgiOyOgoDQTxyRJJyACeBOQpUBBJEC7UPmoAHrW2IKYAIgQImurJGNgJALIeELrIABSzqOsAlH5rQSFMbCzcFwDWEF3EADyVE5DOXm0AfLsEAFxVI4AgCCUG0XSe9x6ykqX2QADJkIYTABtAC6AG4LssjPIXm91J5TgEfv9ASCwXAISiod5KgAaKo0h50tFor4Y7g3AC+9HoqRIyWIBDkqwBtAcAI0MiaUE56ClmllnIQipl0GQ3OQAF46JLkABGAAMjIVyAATCaUgCAMxGzX8oikJEiiCrc3i-XS5WNNWyzU6l2irB8gXOmAEAhMXW7KHECngyEs5RgLrWbzC4OYc1fE7auEMbhh5IyOBmcUogDSyFAyFpKbTEAzrvdaPFEbJ3ug3K1uolcE9HYBxs1psHkYBls1vIuAyEIjrD3KpbMsYeOrhK+ZXTRgQ7R3oM47u1WAUCcd2mbdWHNRyOQA) that lead to runtime error while typescript thinks that everything is fine. 

The `ts-keys-compiler` package presents safe workaround thanks to use of custom typescript transformer

# How does it work?

The package contains function `keyTransform` for transformation `Object.getOwnPropertyNames<typeof o>(o)` expression to array of keys in result file and overriden type for `ObjectConstructor.getOwnPropertyNames` that returns `Array<keyof T>` for safe transformation cases, whenever possible, else - `string[]`. For example: 

```ts
let ae = { a: 1, b: 1 }
let keys = Object.getOwnPropertyNames<typeof ae>(ae)
```

will be converted to

```ts
let ae = { a: 1, b: 1 }
let keys = ["a", "b"]
```

## Constraints:

There are several limitations for security and transparency reasons. The `getOwnPropertyNames` method return `(keyof typeof obj)[]` instead of `string[]` and makes appropriate transformation only when the following rules are followed:
- Generic type should be explicitly specified in the calling signature. It's kind of a way to choose exactly how to handle the construction during development: 
   ```ts
   let ae = { a: 1, b: 1 }
   let strs = Object.getOwnPropertyNames(ae)             // string[]
   let keys = Object.getOwnPropertyNames<typeof ae>(ae)  // (keyof AE)[]
   ```
- The type should contains just required fields to avoid the discrepancy of the list of fields with the runtime:
   
   with optional fields:
   ```ts   
   type A = { a: 1, b?: 1 }
   let ae: A = { a: 1, b: 1 }
   let ks = Object.getOwnPropertyNames<A>(ae)            // string[]
   ```
   with required fields:
   ```ts   
   type A = { a: 1, b: 1 }
   let ae: A = { a: 1, b: 1 }
   let ks = Object.getOwnPropertyNames<A>(ae)            // (keyof AE)[]
   ```   
- The type should not be union for the same reason:
   ```ts
   type U = { a: 1 } | { a: 1, b: 1 }
   let aa: U = { a: 1, b: 1 }
   let k = Object.getOwnPropertyNames<U>(aa)             // string[]
   ```

# How to use this package

Properly using the package consists of the three following steps (both of them required!):

- Installation: 

  ```
  npm i -D Sanshain/ts-keys-compiler
  ```
- Addition of the package to the include section of your `tscofig.json` (if `node_modules` didn't...):
   ```
    "include": [
      // ...
      "node_modules/ts-keys-compiler"
   ]
   ```
- Tuning custom transformer which is used to compile the `keys` function correctly: look up point "**How to use the custom transformer**":


## How to use the custom transformer

Unfortunately, TypeScript itself does not currently provide any way to use custom transformers by tsconfig.json (See https://github.com/Microsoft/TypeScript/issues/14419) and requires using itself API.
The followings are the usage examples of the API with the transformer for the most common cases:

### webpack (with ts-loader or awesome-typescript-loader)

See [examples/webpack](examples/webpack) for detail.

```js
// webpack.config.js
const keysTransformer = require('ts-transformer-keys/transformer').default;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader', // or 'awesome-typescript-loader'
        options: {
          // make sure not to set `transpileOnly: true` here, otherwise it will not work
          getCustomTransformers: program => ({
              before: [
                  keysTransformer(program)
              ]
          })
        }
      }
    ]
  }
};

```

### Rollup (with rollup-plugin-typescript2)

See [examples/rollup](examples/rollup) for detail.

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import keysTransformer from 'ts-transformer-keys/transformer';

export default {
  // ...
  plugins: [
    resolve(),
    typescript({ transformers: [service => ({
      before: [ keysTransformer(service.getProgram()) ],
      after: []
    })] })
  ]
};
```

### ttypescript

See [examples/ttypescript](examples/ttypescript) for detail.
See [ttypescript's README](https://github.com/cevek/ttypescript/blob/master/README.md) for how to use this with module bundlers such as webpack or Rollup.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "plugins": [
      { "transform": "ts-transformer-keys/transformer" }
    ]
  },
  // ...
}
```

### ts-jest

See [examples/ts-jest](examples/ts-jest) for details.
In order to use this transformer with ts-jest, you need to add a wrapper around it like this:

```javascript
// ts-jest-keys-transformer.js
const keysTransformer = require('ts-transformer-keys/transformer').default;
const name = 'my-key-transformer';
const version = 1;
const factory = (cs) => (ctx) => keysTransformer(cs.program)(ctx);
// For ts-jest 26 use:
// const factory = (cs) => (ctx) => keysTransformer(cs.tsCompiler.program)(ctx);

module.exports = { name, version, factory };
```

And add it in `jest.config.js` like this:

```javascript
  globals: {
    'ts-jest': {
      // relative path to the ts-jest-keys-transformer.js file
      astTransformers: { before: ['src/react/ts-jest-keys-transformer.js'] },
    },
  },
```

Note: ts-jest 26.4.2 does not work with this transformer (fixed in ts-jest 26.4.3). Also, for versions smaller than 26.2, you need to provide the transformer in an array instead, like this: `astTransformers: { before: ['src/react/ts-jest-keys-transformer.js'] }`

### TypeScript API

See [test](test) for detail.
You can try it with `$ npm test`.

```js
const ts = require('typescript');
const keysTransformer = require('ts-transformer-keys/transformer').default;

const program = ts.createProgram([/* your files to compile */], {
  strict: true,
  noEmitOnError: true,
  target: ts.ScriptTarget.ES5
});

const transformers = {
  before: [keysTransformer(program)],
  after: []
};
const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, transformers);

if (emitSkipped) {
  throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
}
```

As a result, the TypeScript code shown [here](#how-to-use-keys) is compiled into the following JavaScript.

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_transformer_keys_1 = require("ts-transformer-keys");
var keysOfProps = ["id", "name", "age"];
console.log(keysOfProps); // ['id', 'name', 'age']
```


## What about `Object.keys`?

This package by default is configurated to use `Object.getOwnPropertyNames` signature for keys transformation instead of `Object.keys`. **Why?**

The difference among the methods is that `Object.keys`, unlike `Object.getOwnPropertyNames`, returns *only enumerated properties*. It is important to note that typescript itself cannot control the enumerability of properties, since javascript in runtime allows you to change it for those of them that do not have the `configurable: false` clause set (that is, all properties for which it is not explicitly set). Therefore ts cann't detect the p-roperty state. However, using these properties inside source ts code even outside the enumeration supposes that the fields will still be explicitly described in types, rather than not at all.

#### When `Object.keys` more preferred?

Despite the ways to make non-enumerable fields in runtime (via `object.create` or modification descriptor from `getPropertyDescriptor`), many developers prefer not to use this feature to make the code more obvious. 

Therefore, for them there is no difference, except that the `keys` consists of a less number of letters. For such cases, it may be reasonably to use `keys` method for transformations and at all. 

#### Using `keys` for transformataion requires the following steps:

- specify path for `keys.d.ts` instead of `node_modules/ts-keys-compiler` at include option of your `tsconfig.json`:
   
   ```json
   "include": [
      "node_modules/ts-keys-compiler/sources/keys.d.ts"
   ],   
   ```
- pass `keys` as methodName option to transform function: 
   ```ts
   keysTransform(program, {methodName: 'keys'})
   ```


## Impact on performance

On the tested hardware, for 40 files with 1600 lines of ts code (i.e. 64 thousand lines of code, respectively), 
and 5 corresponding constructs for transformation in each file, the difference in compilation speed did not exceed 10% (~1.550 sec vs ~1.700 sec).
 But even if it has weight, you can use the transformer only for production mode like this:
 
 ```js
 typescript({
   transformers: production ? [service => {
      const program = service.getProgram()
      return {
         before: program ? [keysTransform(program)] : [],
         after: []
      }
   }] : []
})
 ```



# License

MIT

[npm-image]:https://img.shields.io/npm/v/ts-transformer-keys.svg?style=flat

