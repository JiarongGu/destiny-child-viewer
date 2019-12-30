import { CacheContext } from '@models';
import { tryGet } from './method-cache';
import { reduceKeys } from './reduce-keys';

export const cacheContexts = new Map<string, CacheContext>();

Object.defineProperty(window, 'cacheContext', {
  get: () => reduceKeys(Array.from(cacheContexts.keys()), key => cacheContexts.get(key)?.main)
});

export function getCacheContext(name: string) {
  return tryGet<CacheContext, string>(cacheContexts, name, () => ({
    main: new Map(),
    util: new Map()
  }));
}