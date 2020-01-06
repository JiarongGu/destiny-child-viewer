import { CacheContext } from '@shared/models';
import { tryGet, tryArrayGet } from '@shared/utils';

export const memorize = ({ main }: CacheContext, cacheName?: string) => (
  _: Object, key: String, descriptor: TypedPropertyDescriptor<any>
) => {
  const getter = descriptor.get;
  const method = descriptor.value;
  const valid = getter || method;

  if (!valid) {
    return descriptor;
  }

  const methodId = cacheName || key;
  const methodCache = tryGet(main, methodId, () => new Map());

  if (method) {
    descriptor.value = function () {
      return tryArrayGet(methodCache, methodId, Array.from(arguments), () => method.apply(this, arguments as any));
    };
    Object.defineProperties(descriptor.value, Object.getOwnPropertyDescriptors(method));
  }

  if (getter) {
    descriptor.get = function () {
      return tryGet(methodCache, methodId, () => getter.apply(this));
    };
    Object.defineProperties(descriptor.get, Object.getOwnPropertyDescriptors(getter));
  }

  return descriptor;
};
