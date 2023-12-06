type Filtered<T extends AnyObject> = { [P in keyof T]: true extends T[P] ? P : never };

export type GetFilteredKeys<T extends AnyObject> = Extract<keyof Filtered<T>, string>;

export type GetOverridedKeys<
  T extends string | number,
  U extends AnyObject = EmptyObject,
> = GetFilteredKeys<Merge<Record<T, true>, U>>;
