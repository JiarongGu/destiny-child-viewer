export function tryArrayGet(map: Map<any, any>, defaultKey: any, keys: Array<any>, get: () => any) {
  if (keys.length <= 1) {
    return tryGet(map, keys[0] || defaultKey, get);
  }
  const currentKey = keys[0];
  const nextKeys = keys.slice(1);
  const currentMap = tryGet(map, currentKey, () => new Map<any, any>());
  return tryArrayGet(currentMap, currentKey, nextKeys, get);
}

export function tryGet<T = any, K = any>(map: Map<K, T>, key: K, get: () => T) {
  let value = map.get(key);
  if (!value) {
    value = get();
    map.set(key, value);
  }
  return value;
}

export function tryArrayGetAsync(
  map: Map<any, any>,
  utilMap: Map<any, any>,
  defaultKey: any,
  keys: Array<any>,
  get: () => Promise<any>
) {
  if (keys.length <= 1) {
    return tryGetAsync(map, utilMap, keys[0] || defaultKey, get);
  }
  const currentKey = keys[0];
  const nextKeys = keys.slice(1);
  const currentMap = tryGet(map, currentKey, () => new Map<any, any>());
  const currentUtilMap = tryGet(utilMap, currentKey, () => new Map<any, any>());

  return tryArrayGetAsync(currentMap, currentUtilMap, currentKey, nextKeys, get);
}

export function tryGetAsync(
  map: Map<any, any>,
  promiseMap: Map<any, Promise<any>>,
  key: any,
  get: () => Promise<any>
): Promise<any> {
  const value = map.get(key);
  if (!value) {
    let promise = promiseMap.get(key);
    if (!promise) {
      promise = get();
      promiseMap.set(key, promise);
      promise
        .then(value => {
          map.set(key, value);
        })
        .finally(() => {
          promiseMap.delete(key);
        });
    }
    return promise;
  }
  return Promise.resolve(value);
}
