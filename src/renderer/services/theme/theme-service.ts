import { RemoteService, IThemeRepository, RemoteServiceType } from '@shared/remote';

export class ThemeService {
  private readonly _themeRepository = new RemoteService<IThemeRepository>(RemoteServiceType.Theme);

  public async getMusicCollection() {
    return await this._themeRepository.invoke('getMusicCollection');
  }
}