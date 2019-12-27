import * as electron from 'electron';
import * as path from 'path';

import { EnvironmentService } from '@services/environment/environment-service';
import { memorize } from '@decorators/memorize/memorize';

export class PathService {
  private _environmentService: EnvironmentService;

  constructor() {
    this._environmentService = new EnvironmentService();
  }

  @memorize
  public get resourcesPath() {
    if (this._environmentService.isDevelopment) {
      return process.env.APP_RESOURCES as string;
    }
    return electron.remote.process.resourcesPath;
  }

  @memorize
  public get assetPath() {
    return path.join(this.resourcesPath, 'asset');
  }

  @memorize
  public get dataPath() {
    return path.join(this.resourcesPath, 'data');
  }

  @memorize
  public get appPath() {
    return electron.remote.app.getAppPath();
  }

  public getAssetPath(filePath: string) {
    return path.join(this.assetPath, filePath);
  }

  public getDataPath(filePath: string) {
    return path.join(this.dataPath, filePath);
  }

  public getResourcePath(filePath: string) {
    return path.join(this.resourcesPath, filePath);
  }

  public getAbsolutePath(relativePath: string): string {
    return `${this.appPath}/${relativePath}`;
  }

  public getRelativePath(absolutePath: string): string {
    if (absolutePath.indexOf(this.appPath) > -1) {
      return absolutePath.substring(this.appPath.length + 1);
    }
    return absolutePath;
  }
}
