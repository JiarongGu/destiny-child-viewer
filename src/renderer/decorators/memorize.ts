import { CacheContext } from '@models';
import { tryGet, tryArrayGet } from '@utils';

export const memorize = ({ main }: CacheContext, cacheName?: string) => (
  target: Object, key: String, descriptor: TypedPropertyDescriptor<any>
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
  }

  if (getter) {
    descriptor.get = function () {
      return tryGet(methodCache, methodId, () => getter.apply(this));
    };
  }

  return descriptor;
};
