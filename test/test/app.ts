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
type U = { a: 1 } | {
   a: 1,
   b: 1
}
let aa: U = { a: 1, b: 1 }
let k = Object.getOwnPropertyNames<U>(aa)                   // union =>       false
type Any = any
let ks = Object.getOwnPropertyNames(a)                      // no generic =>  false
type AE = {a: 1, b?: 1}
let ae: AE = { a: 1, b: 1 }
let ks1 = Object.getOwnPropertyNames<AE>(ae)                // optional =>    false
console.log(ks);


{
   type A = { a: 1, b?: 1 }
   let ae: A = { a: 1, b: 1 }
   let ks = Object.getOwnPropertyNames<A>(ae)               // optional =>    false
}

{
   let ab = { a: 1, b: 1 } as const
   let abc = { a: 1, b: 1, c: 1 } as const
   ab = abc
   let ks = Object.getOwnPropertyNames<typeof ab>(ab)        // true
}



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


