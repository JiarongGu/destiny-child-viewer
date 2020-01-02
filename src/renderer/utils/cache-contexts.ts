import { CacheContext } from '@models';
import { tryGet } from './method-cache';

export const cacheContexts = new Map<string, CacheContext>();

(window as any).cacheContexts = cacheContexts;

export function getCacheContext(name: string) {
  return tryGet<CacheContext, string>(cacheContexts, name, () => new CacheContext());
}