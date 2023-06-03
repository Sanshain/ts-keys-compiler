
interface Foo {
  foo: string;
}

export default class TestClass {
  testMethod(){    
    const fooKeys = Object.getOwnPropertyNames<Foo>({foo: 1});
    return fooKeys
  }
}
