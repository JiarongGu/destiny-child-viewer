import { generateId } from '@utils/generateId';
import { tryGet, tryArrayGet } from './method-cache';

const targetMap = new Map<Object, string>();
const cacheMap = new Map<Object, Map<Object, any>>();

export const memorize = (target: Object, key: String, descriptor: TypedPropertyDescriptor<any>) => {
  const method = descriptor.value;
  if (!method) {
    return descriptor;
  }
  const targetId = tryGet(targetMap, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;

  descriptor.value = function() {
    return tryArrayGet(cacheMap, methodId, Array.from(arguments), () => method.apply(this, arguments as any));
  };
  return descriptor;
};
