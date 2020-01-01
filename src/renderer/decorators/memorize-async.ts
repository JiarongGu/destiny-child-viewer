import { tryArrayGetAsync } from '@utils';
import { CacheContext } from '@models';

export const memorizeAsync = ({ main, util }: CacheContext, methodCacheName?: string) => (
  target: Object, key: String, descriptor: TypedPropertyDescriptor<any>
) => {
  const method = descriptor.value;
  if (!method) {
    return descriptor;
  }

  const methodId = methodCacheName || key;

  descriptor.value = function () {
    return tryArrayGetAsync(main, util, methodId, Array.from(arguments), () =>
      method.apply(this, arguments as any)
    );
  };
  return descriptor;
};
