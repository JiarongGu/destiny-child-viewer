import { generateId } from '@utils/generate-id';
import { tryGet, tryArrayGetAsync } from './method-cache';

const targetMap = new Map<Object, string>();
const cacheMap = new Map<Object, Map<Object, any>>();
const promiseMap = new Map<Object, any>();

export const memorizeAsync = (target: Object, key: String, descriptor: TypedPropertyDescriptor<any>) => {
  const method = descriptor.value;
  if (!method) {
    return descriptor;
  }
  const targetId = tryGet(targetMap, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;

  descriptor.value = function() {
    return tryArrayGetAsync(cacheMap, promiseMap, methodId, Array.from(arguments), () =>
      method.apply(this, arguments as any)
    );
  };
  return descriptor;
};
