export declare type TypedChange<T> = {
  previousValue: T;
  currentValue: T;
  firstChange: boolean;
  isFirstChange(): boolean;
}

export declare type TypedChanges<T> = {
  [propName in keyof T]: TypedChange<T[propName]>;
};

export declare type Key<T> = keyof T
export declare type Action<T> = () => T
export const Noop: Action<void> = () => {}

export declare type TClass<T> = { new(...args: any[]): T }

export declare type Indexed<T> = {
  [name: string]: T
}
