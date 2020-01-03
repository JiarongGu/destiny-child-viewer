
import { memorizeAsync } from '@decorators';
import { IconRepository } from '@repositories';
import { IconModel, IconModelCollection } from '@models/data';
import { reduceKeysAsync, getCacheContext } from '@utils';

import { PathService } from './path-service';
import { FileService, FileReadType } from './file-service';

export class IconService {
  public static cacheContext = getCacheContext('icon-service');

  private readonly _pathService = new PathService();
  private readonly _fileService = new FileService();
  private readonly _iconRepository = new IconRepository();

  public async listIcons(): Promise<IconModelCollection> {
    return this._iconRepository.listIcons();
  }

  @memorizeAsync(IconService.cacheContext, 'character-icons')
  public async getCharacterIcons(characterId: string): Promise<IconModel> {
    const icons = await this._iconRepository.getCharacterIcons(characterId);
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.getVariantIcons(characterId, variantId)
    );
  }

  @memorizeAsync(IconService.cacheContext, 'variant-icons')
  public async getVariantIcons(characterId: string, variantId: string) {
    const icons = await this._iconRepository.getVariantIcons(characterId, variantId);
    return reduceKeysAsync(Object.keys(icons), type => this.getIcon(characterId, variantId, type));
  }

  @memorizeAsync(IconService.cacheContext, 'icon')
  public async getIcon(characterId: string, variantId: string, type: string): Promise<string> {
    const icon = await this._iconRepository.getIcon(characterId, variantId, type);
    return icon && await this._fileService.get(this._pathService.getAssetPath(icon), FileReadType.URL);
  }
}