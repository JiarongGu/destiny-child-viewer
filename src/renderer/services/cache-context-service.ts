import { CacheContext } from '@models';
import { tryGet } from '@utils';

export class CacheContextService {
  public static cacheContexts = new Map<string, CacheContext>();

  public static get(name: string) {
    return tryGet<CacheContext, string>(CacheContextService.cacheContexts, name, () => ({
      main: new Map(),
      util: new Map()
    }));
  }
}