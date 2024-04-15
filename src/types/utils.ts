export type GenerateType<T> = {
  [K in keyof T]: T[K];
};
