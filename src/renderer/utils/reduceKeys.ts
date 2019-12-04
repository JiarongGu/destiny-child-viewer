export function reduceKeys<T = any>(keys: Array<string>, formatter: (key: string, index: number) => T) {
  return keys.reduce(
    (accumulate, key, index) => ((accumulate[key] = formatter(key, index)), accumulate),
    {} as { [key: string]: T }
  );
}
