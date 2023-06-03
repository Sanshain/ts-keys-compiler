// import { keys } from '../../index';


type A = {
  a: number,
  b: number
}

const a: A = {
  a: 1,
  b: 1
}

// let ks = keys<typeof a>()
type U = { a: 1 } | A
type Any = any
let ks = Object.getOwnPropertyNames<any>(a)
let ae = { a: 1 }
let ks1 = Object.getOwnPropertyNames<typeof ae>(ae)
console.log(ks);





// type IsUnion<T, U extends T = T> = T extends unknown
//    ? [U] extends [T]
//       ? false
//       : true
//    : false;



// type FooBar = {
//    foo: string;
//    bar?: number;
// };
// let fooBar = { foo: '' }

// interface BarBaz {
//    baz: Date;
// }

// let r = Object.keys<FooBar | BarBaz>(fooBar)


