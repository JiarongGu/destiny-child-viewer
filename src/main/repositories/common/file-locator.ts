import { PathService } from '../../services';

export class FileLocator {
  private static pathService = new PathService();

  // game assets
  public static get RENDER_MODEL_INFO() {
    return this.pathService.getResourcePath('asset/asset/character/model_info.json');
  }

  public static get HOME_ICON_DIRECTORY() {
    return this.pathService.getResourcePath('asset/asset/icon/portrait');
  }

  public static get BATTLE_ICON_DIRECTORY() {
    return this.pathService.getResourcePath('asset/asset/icon/portrait_battle');
  }

  public static get SPA_ICON_DIRECTORY() {
    return this.pathService.getResourcePath('asset/asset/icon/spa');
  }

  public static get CHARACTER_DIRECTORY() {
    return this.pathService.getResourcePath('asset/asset/character');
  }

  public static get VOICE_DIRECTORY() {
    return this.pathService.getResourcePath('asset/asset/sound/voice');
  }

  public static get BGM_DIRECTORY() {
    return this.pathService.getResourcePath('asset/bgm');
  }

  // static data
  public static get CHILD_STATIC() {
    return this.pathService.getResourcePath('static/child.json');
  }

  // generated data
  public static get LOCALE_STATIC() {
    return this.pathService.getResourcePath('static/locale.json');
  }

  public static get ICON_STATIC() {
    return this.pathService.getResourcePath('static/icon.json');
  }

  public static get THEME_STATIC() {
    return this.pathService.getResourcePath('static/theme.json');
  }

  public static get CHARACTER_STATIC() {
    return this.pathService.getResourcePath('static/character.json');
  }

  // runtime data
  public static get CHARACTER_DATA() {
    return this.pathService.getResourcePath('data/character.json');
  }

  public static get LIVE2D_DATA() {
    return this.pathService.getResourcePath('data/live2d.json');
  }
}