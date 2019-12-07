export enum Environment {
  Development = 'development',
  Production = 'production'
}

export class EnvironmentService {
  public environment: Environment;

  constructor() {
    this.environment = process.env.NODE_ENV as Environment;
  }

  public get isDevelopment() {
    return this.environment === Environment.Development;
  }
}
