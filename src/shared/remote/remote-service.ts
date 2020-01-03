import { ipcRenderer } from 'electron';

import { RemoteServiceType } from '@shared/remote';

type Method<T, K extends keyof T> = T[K] extends (...args: any) => any ? T[K] : never; 
type Return<T, K extends keyof T> = Promise<ReturnType<Method<T, K>>>;
type Param<T, K extends keyof T> = Parameters<Method<T, K>>;

export class RemoteService<T> {
  private readonly _serviceType: RemoteServiceType;
  
  constructor(serviceType: RemoteServiceType) {
    this._serviceType = serviceType;
  }
  public invoke<K extends keyof T>(method: K, ...args: Param<T, K>): Return<T, K> {
    return ipcRenderer.invoke(this._serviceType, method, args);
  }
}