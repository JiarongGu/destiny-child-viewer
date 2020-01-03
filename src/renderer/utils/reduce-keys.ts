import { reduceMap, reduceMapAsync } from './reduce-map';

export function reduceKeys<T, K extends string | number>(keys: Array<K>, formatter: (key: K, index: number) => T) {
  return reduceMap(keys, key => key, formatter);
}

export function reduceKeysAsync<T, K extends string | number>(
  keys: Array<K>, formatter: (key: K, index: number) => Promise<T>
) {
  return reduceMapAsync(keys, key => key, formatter);
}
