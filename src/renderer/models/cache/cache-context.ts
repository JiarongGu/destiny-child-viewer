export class CacheContext {
  public main = new Map<string, Map<any, any>>();
  public util = new Map<string, Map<any, any>>();

  public get(key: string) {
    return this.main.get(key);
  }
}