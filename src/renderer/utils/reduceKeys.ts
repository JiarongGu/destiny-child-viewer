export function reduceKeys<T = any>(keys: Array<string>, formatter: (key: string) => T) {
  return keys.reduce((accumulate, key) => ((accumulate[key] = formatter(key)), accumulate), {} as { [key: string]: T });
}
