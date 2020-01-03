import { tryArrayGetAsync, tryGet, tryGetAsync } from '@shared/utils';
import { CacheContext } from '@shared/models';

export const memorizeAsync = ({ main, util }: CacheContext, cacheName?: string) => (
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
  const methodUtilCache = tryGet(util, methodId, () => new Map());

  if (method) {
    descriptor.value = function () {
      return tryArrayGetAsync(methodCache, methodUtilCache, methodId, Array.from(arguments), () =>
        method.apply(this, arguments as any)
      );
    };
  }

  if (getter) {
    descriptor.get = function () {
      return tryGetAsync(methodCache, methodUtilCache, methodId, () => getter.apply(this));
    };
  }
  return descriptor;
};
