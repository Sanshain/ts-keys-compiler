type UnionToIntersection<U> =
   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true


interface ObjectConstructor {
   /**
    * Returns the names of the enumerable string properties and methods of an object.
    * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
    */
   // getOwnPropertyNames<T>(o: T): T extends object ? string[] : undefined[];
   getOwnPropertyNames(o: object): string[];
   keys<T>(o: T): T extends object ? string[] : undefined[];

   getOwnPropertyNames<T extends object>(o: T): IsUnion<T> extends true ? string[] : (T extends Required<T>
      ? string[] extends Array<keyof T> ? string[] : Array<keyof T>
      : string[])

   // keys<T extends object>(o: T): T extends Required<T>
   //    ? string[] extends Array<keyof T> ? string[] : Array<keyof T>
   //    : string[];

   // entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
}


