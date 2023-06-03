// import "ts-keys-compiler";

type U = { a: 1 } | {
   a: 1,
   b: 1
}
let aa: U = { a: 1, b: 1 }
let k = Object.getOwnPropertyNames<U>(aa)

type AE = { a: 1, b: 1 }
let ae: AE = { a: 1, b: 1 }
let ks = Object.getOwnPropertyNames<AE>(ae)

console.log(k);
console.log(ks);
