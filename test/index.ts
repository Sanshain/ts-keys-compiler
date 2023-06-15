// import { keys } from '../index';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { compile } from './compile/compile';
import ts from 'typescript';

const fileTransformationDir = path.join(__dirname, 'test');
describe('keys', () => {
   fs.readdirSync(fileTransformationDir).filter((file) => path.extname(file) === '.ts' && file.slice(-5) !== '.d.ts').forEach(file => {
      it(`should transform ${file} as expected`, async () => {
         let result = '';
         const fullFileName = path.join(fileTransformationDir, file), postCompileFullFileName = fullFileName.replace(/\.ts$/, '.js');
         compile(
            [fullFileName, path.join(fileTransformationDir, 'global.d.ts')],
            ts.ScriptTarget['ESNext'],
            (fileName, data) => postCompileFullFileName === path.join(fileName) && (result = data)
         );

         const targetFile = `${file.slice(0, -3)}.${'esnext'}.js`;
         const sampleFile = path.join(fileTransformationDir, `${file.slice(0, -3)}.${'shape'}.js`)
         fs.writeFileSync(path.join(fileTransformationDir, targetFile), result)

         assert.strictEqual(result.replace(/\r\n/g, '\n'), fs.readFileSync(sampleFile, 'utf-8').replace(/\r\n/g, '\n'));
      }).timeout(0)
   })
})

// describe('keys', () => {
//    it('should return keys of given type', () => {
//       //  assert.deepStrictEqual(keys(), []);
//       //  assert.deepStrictEqual(keys<any>(), []);
//       interface Foo {
//          foo: string;
//       }
//       let f: Foo = { foo: '' };
//       assert.deepStrictEqual(Object.getOwnPropertyNames<Foo>(f), ['foo']);
//       type FooBar = {
//          foo: string;
//          bar?: number;
//       };
//       let fooBar = {foo: ''}
//       assert.deepStrictEqual(Object.getOwnPropertyNames<FooBar>(fooBar), ['foo', 'bar']);
//       interface BarBaz {
//          baz: Date;
//       }
//       let barBaz: FooBar & BarBaz = { baz: new Date, foo: '' }
//       assert.deepStrictEqual(Object.getOwnPropertyNames<FooBar & BarBaz>(barBaz), ['foo', 'bar', 'baz']);
//       assert.deepStrictEqual(Object.getOwnPropertyNames<FooBar | BarBaz>({foo: 'new Date'}), ['bar']);
//       assert.deepStrictEqual(Object.getOwnPropertyNames<FooBar & any>(1), []);
//       assert.deepStrictEqual(Object.getOwnPropertyNames<FooBar | any>(''), []);
//    });
//    // const fileTransformationDir = path.join(__dirname, 'fileTransformation$');
//    // fs.readdirSync(fileTransformationDir).filter((file) => path.extname(file) === '.ts').forEach(file =>
//    //    (['ES5', 'ESNext'] as const).forEach(target =>
//    //       it(`should transform ${file} as expected when target is ${target}`, async () => {
//    //          let result = '';
//    //          const fullFileName = path.join(fileTransformationDir, file), postCompileFullFileName = fullFileName.replace(/\.ts$/, '.js');
//    //          compile([fullFileName], ts.ScriptTarget[target], (fileName, data) => postCompileFullFileName === path.join(fileName) && (result = data));
//    //          fs.writeFileSync(path.join(fileTransformationDir, `r.${target}.${file}`), result)
//    //          // assert.strictEqual(result.replace(/\r\n/g, '\n'), fs.readFileSync(fullFileName.replace(/\.ts$/, `.${target}.js`), 'utf-8').replace(/\r\n/g, '\n'));
//    //       }).timeout(0)
//    //    )
//    // );
// });
