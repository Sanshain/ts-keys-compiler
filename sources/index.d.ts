// export function keys<T extends object>(): Array<keyof T>;

interface ObjectConstructor {

  getOwnPropertyNames<T extends object>(o: T): T extends Required<T> ? Array<keyof T> : string[];

  // keys<T extends object>(o: T): T extends Required<T> ? Array<keyof T> : string[];
  // entries<T extends object>(o: T): Array<[keyof T, T[keyof T]]>;
}
