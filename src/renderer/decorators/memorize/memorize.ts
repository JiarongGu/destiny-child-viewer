import { generateId } from '@utils/generate-id';
import { tryGet, tryArrayGet } from './method-cache';

const targetMap = new Map<Object, string>();
const cacheMap = new Map<Object, Map<Object, any>>();

export const memorize = (target: Object, key: String, descriptor: TypedPropertyDescriptor<any>) => {
  const getter = descriptor.get;
  const method = descriptor.value;
  const valid = getter || method;

  if (!valid) {
    return descriptor;
  }

  const targetId = tryGet(targetMap, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;

  if (method) {
    descriptor.value = function() {
      return tryArrayGet(cacheMap, methodId, Array.from(arguments), () => method.apply(this, arguments as any));
    };
  }

  if (getter) {
    descriptor.get = function() {
      return tryGet(cacheMap, methodId, () => getter.apply(this));
    };
  }

  return descriptor;
};
