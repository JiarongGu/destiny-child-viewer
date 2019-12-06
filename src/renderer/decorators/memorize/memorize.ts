import { generateId } from '@utils/generateId';

const targetMap = new Map<Object, string>();
const methodCacheMap = new Map<Object, Map<Object, any>>();

function createCacheMethod(cacheMethodMap: Map<any, any>, method: Function) {
  function cacheMethod() {
    const args = Array.from(arguments);
    if (args.length === 0) {
      return method();
    }
    let currentCacheMethod;
    while (args.length > 0) {
      const current = args.splice(1);
      const currentCacheMethodMap = new Map<any, any>();
      const currentMethod = nextArgs => method(current, ...nextArgs);
      currentCacheMethod = tryGet(cacheMethodMap, current, () =>
        createCacheMethod(currentCacheMethodMap, currentMethod)
      );
    }
    return currentCacheMethod;
  }
  return cacheMethod;
}

function tryGet(map: Map<any, any>, key: any, get: () => any) {
  let value = map.get(key);
  if (!value) {
    value = get();
    map.set(key, value);
  }
  return value;
}

export const memorize = (target: Object, key: String, descriptor: TypedPropertyDescriptor<any>) => {
  const method = descriptor.value;
  if (!method) {
    return descriptor;
  }
  const targetId = tryGet(targetMap, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;
  const methodCache = tryGet(methodCacheMap, methodId, () => new Map());
  const cacheMethod = createCacheMethod(methodCache, method);
  descriptor.value = function() {
    return cacheMethod.apply(this, arguments as any);
  };
  return descriptor;
};
