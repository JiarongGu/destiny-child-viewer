import { CacheContext } from '@models';
import { generateId, tryGet, tryArrayGet } from '@utils';

export const memorize = ({ main, util }: CacheContext) => (
  target: Object, key: String, descriptor: TypedPropertyDescriptor<any>
) => {
  const getter = descriptor.get;
  const method = descriptor.value;
  const valid = getter || method;

  if (!valid) {
    return descriptor;
  }

  const targetId = tryGet(util, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;

  if (method) {
    descriptor.value = function () {
      return tryArrayGet(main, methodId, Array.from(arguments), () => method.apply(this, arguments as any));
    };
  }

  if (getter) {
    descriptor.get = function () {
      return tryGet(main, methodId, () => getter.apply(this));
    };
  }

  return descriptor;
};
