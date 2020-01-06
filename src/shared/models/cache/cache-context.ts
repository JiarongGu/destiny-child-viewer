export class CacheContext<K = string> {
  public main: Map<K, any>;
  public util: Map<K, any>;

  constructor(main?: Map<K, any>, util?: Map<K, any>) {
    this.main = main || new Map<K, any>();
    this.util = util || new Map<K, any>();
  }

  public get(key: K) {
    const result1 = this.main.get(key);
    const result2 = this.util.get(key);
    if (result1 && result2) {
      // so this must by processing queue
      return new CacheContext(result1, result2);
    }

    return result1 || result2;
  }

  public delete(key: K) {
    return this.main.delete(key) || this.util.delete(key);
  }
}