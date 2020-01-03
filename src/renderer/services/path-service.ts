import * as electron from 'electron';
import * as path from 'path';

import { EnvironmentService } from './environment-service';

export class PathService {
  private _environmentService: EnvironmentService;

  constructor() {
    this._environmentService = new EnvironmentService();
  }

  public get resourcesPath() {
    if (this._environmentService.isDevelopment) {
      return process.env.APP_RESOURCES as string;
    }
    return electron.remote.process.resourcesPath;
  }

  public get assetPath() {
    return path.join(this.resourcesPath, 'asset');
  }

  public get dataPath() {
    return path.join(this.resourcesPath, 'data');
  }

  public get staticPath() {
    return path.join(this.resourcesPath, 'static');
  }

  public get appPath() {
    return electron.remote.app.getAppPath();
  }

  public getAssetPath(filePath: string) {
    return path.join(this.assetPath, filePath);
  }

  public getDataPath(filePath: string) {
    return path.join(this.dataPath, filePath);
  }

  public getStaticPath(filePath: string) {
    return path.join(this.staticPath, filePath);
  }

  public getResourcePath(filePath: string) {
    return path.join(this.resourcesPath, filePath);
  }

  public relativeAssetPath(filePath: string): string {
    return path.relative(this.assetPath, filePath);
  }

  public relativeStaticPath(filePath: string): string {
    return path.relative(this.staticPath, filePath);
  }
}
