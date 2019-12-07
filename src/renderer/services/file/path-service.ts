import * as electron from 'electron';

import { EnvironmentService } from '@services/environment/environment-service';
import { memorize } from '@decorators/memorize/memorize';

export class PathService {
  private _environmentService: EnvironmentService;
  private _pathCache: { [key: string]: string };

  constructor() {
    this._environmentService = new EnvironmentService();
    this._pathCache = {};
  }

  @memorize
  public resourcesPath(...args: Array<any>) {
    console.log('called:: ', args);

    if (this._environmentService.isDevelopment) {
      return process.env.APP_RESOURCES as string;
    }
    return electron.remote.process.resourcesPath;
  }

  private tryGet(name: string, getter: () => string) {
    if (!this._pathCache[name]) {
      this._pathCache[name] = getter();
    }
    return this._pathCache[name];
  }
}
