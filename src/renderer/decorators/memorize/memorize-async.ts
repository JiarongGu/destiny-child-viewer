import { generateId, tryGet, tryArrayGetAsync } from '@utils';
import { CacheContext } from '@models';

export const memorizeAsync = ({ main, util }: CacheContext) => (
  target: Object, key: String, descriptor: TypedPropertyDescriptor<any>
) => {
  const method = descriptor.value;
  if (!method) {
    return descriptor;
  }
  const targetId = tryGet(util, target, () => generateId());
  const methodId = `${targetId}:${key.toString()}`;

  descriptor.value = function () {
    return tryArrayGetAsync(main, util, methodId, Array.from(arguments), () =>
      method.apply(this, arguments as any)
    );
  };
  return descriptor;
};
