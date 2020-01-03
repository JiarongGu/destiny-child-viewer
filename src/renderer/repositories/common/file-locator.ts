import { PathService } from '@services/path-service';

export class FileLocator {
  private static pathService = new PathService();

  // game assets
  public static get RENDER_MODEL_INFO() { 
    return this.pathService.getAssetPath('asset/character/model_info.json') 
  }
  
  public static get HOME_ICON_DIRECTORY() { 
    return this.pathService.getAssetPath('asset/icon/portrait') 
  }
  
  public static get BATTLE_ICON_DIRECTORY() { 
    return this.pathService.getAssetPath('asset/icon/portrait_battle') 
  }
  
  public static get SPA_ICON_DIRECTORY() { 
    return this.pathService.getAssetPath('asset/icon/spa') 
  }

  public static get CHARACTER_DIRECTORY() {
    return this.pathService.getAssetPath('asset/character')
  }

  // static data / generated data
  public static get LOCALE_DATA() {
    return this.pathService.getStaticPath('locale.json') 
  }

  public static get CHILD_DATA() { 
    return this.pathService.getStaticPath('child.json') 
  }

  public static get ICON_DATA() { 
    return this.pathService.getStaticPath('icon.json') 
  }

  public static get SOUND_DATA() { 
    return this.pathService.getStaticPath('sound.json') 
  }

  public static get TITLE_DATE() { 
    return this.pathService.getStaticPath('title.json') 
  }

  // runtime data
  public static get CHILD_ADDITIONAL_DATA() { 
    return this.pathService.getDataPath('child-additional.json') 
  }

  public static get LIVE2D_DATA() { 
    return this.pathService.getDataPath('live2d.json') 
  }
}