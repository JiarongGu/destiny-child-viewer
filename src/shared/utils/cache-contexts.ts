import { CacheContext } from '@shared/models';
import { tryGet } from './method-cache';

export const cacheContexts = new Map<string, CacheContext>();
export function getCacheContext(name: string) {
  return tryGet<CacheContext, string>(cacheContexts, name, () => new CacheContext());
}