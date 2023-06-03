// import { keys } from '../index';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { compile } from './compile/compile';
import ts from 'typescript';

describe('keys', () => {
   it('should return keys of given type', () => {
      //  assert.deepStrictEqual(keys(), []);
      //  assert.deepStrictEqual(keys<any>(), []);
      interface Foo {
         foo: string;
      }
      let f: Foo = { foo: '' };
      assert.deepStrictEqual(Object.keys<Foo>(f), ['foo']);
      type FooBar = {
         foo: string;
         bar?: number;
      };
      let fooBar = {foo: ''}
      assert.deepStrictEqual(Object.keys<FooBar>(fooBar), ['foo', 'bar']);
      interface BarBaz {
         baz: Date;
      }
      let barBaz: FooBar & BarBaz = { baz: new Date, foo: '' }
      assert.deepStrictEqual(Object.keys<FooBar & BarBaz>(barBaz), ['foo', 'bar', 'baz']);
      assert.deepStrictEqual(Object.keys<FooBar | BarBaz>({foo: 'new Date'}), ['bar']);
      assert.deepStrictEqual(Object.keys<FooBar & any>(1), []);
      assert.deepStrictEqual(Object.keys<FooBar | any>(''), []);
   });
   const fileTransformationDir = path.join(__dirname, 'fileTransformation$');
   fs.readdirSync(fileTransformationDir).filter((file) => path.extname(file) === '.ts').forEach(file =>
      (['ES5', 'ESNext'] as const).forEach(target =>
         it(`should transform ${file} as expected when target is ${target}`, async () => {
            let result = '';
            const fullFileName = path.join(fileTransformationDir, file), postCompileFullFileName = fullFileName.replace(/\.ts$/, '.js');
            compile([fullFileName], ts.ScriptTarget[target], (fileName, data) => postCompileFullFileName === path.join(fileName) && (result = data));
            assert.strictEqual(result.replace(/\r\n/g, '\n'), fs.readFileSync(fullFileName.replace(/\.ts$/, `.${target}.js`), 'utf-8').replace(/\r\n/g, '\n'));
         }).timeout(0)
      )
   );
});
