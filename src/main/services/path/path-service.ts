import * as path from 'path';

import { EnvironmentService } from '@shared/services';

export class PathService {
  private _environmentService: EnvironmentService;

  constructor() {
    this._environmentService = new EnvironmentService();
  }

  public get resourcesPath() {
    if (this._environmentService.isDevelopment) {
      return process.env.APP_RESOURCES as string;
    }
    return process.resourcesPath;
  }

  public getResourcePath(filePath: string) {
    return path.join(this.resourcesPath, filePath);
  }

  public relativeResourcePath(filePath: string): string {
    return path.relative(this.resourcesPath, filePath);
  }
}
