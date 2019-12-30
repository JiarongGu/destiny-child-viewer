import { reduceMap } from './reduce-map';

export function reduceKeys<T, K extends string | number>(keys: Array<K>, formatter: (key: K, index: number) => T) {
  return reduceMap(keys, key => key, formatter);
}
