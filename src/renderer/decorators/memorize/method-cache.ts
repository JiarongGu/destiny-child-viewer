export function tryArrayGet(map: Map<any, any>, defaultKey: any, keys: Array<any>, get: () => any) {
  if (keys.length === 0) {
    return tryGet(map, defaultKey, get);
  }
  const currentKey = keys[0];
  const nextKeys = keys.slice(1);
  const currentMap = tryGet(map, currentKey, () => new Map<any, any>());
  return tryArrayGet(currentMap, currentKey, nextKeys, get);
}

export function tryGet(map: Map<any, any>, key: any, get: () => any) {
  let value = map.get(key);
  if (!value) {
    value = get();
    map.set(key, value);
  }
  return value;
}

export function tryArrayGetAsync(
  map: Map<any, any>,
  promiseMap: Map<any, any>,
  defaultKey: any,
  keys: Array<any>,
  get: () => Promise<any>
) {
  if (keys.length === 0) {
    return tryGetAsync(map, promiseMap, defaultKey, get);
  }
  const currentKey = keys[0];
  const nextKeys = keys.slice(1);
  const currentMap = tryGet(map, currentKey, () => new Map<any, any>());
  const currentPromiseMap = tryGet(map, currentKey, () => new Map<any, any>());

  return tryArrayGetAsync(currentMap, currentPromiseMap, currentKey, nextKeys, get);
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
      promise.then(value => map.set(key, value)).finally(() => promiseMap.delete(key));
    }
    return promise;
  }
  return Promise.resolve(value);
}
