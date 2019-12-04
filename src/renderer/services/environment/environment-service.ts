import * as electron from 'electron';

export enum Environment {
  Development = 'development',
  Production = 'production'
}

export class EnvironmentService {
  public environment: Environment;
  public resourcesPath: string;
  public appPath: string;

  constructor() {
    this.environment = process.env.NODE_ENV as Environment;
    this.appPath = electron.remote.app.getAppPath();

    if (this.isDevelopment) {
      this.resourcesPath = process.env.APP_RESOURCES as string;
    } else {
      this.resourcesPath = electron.remote.process.resourcesPath;
    }
  }

  public get isDevelopment() {
    return this.environment === Environment.Development;
  }
}
