import { MemorizeContext, memorizeAsync } from 'ts-memorize-decorator';

import { RemoteService, IIconRepository, RemoteServiceType } from '@shared/remote';
import { IconModel, IconModelCollection, reduceKeysAsync } from '@shared';
import { BlobService, BlobReadType } from '../blob';

export class IconService {
  public static cacheContext = new MemorizeContext();
  private readonly _blobService = new BlobService();
  private readonly _iconRepository = new RemoteService<IIconRepository>(RemoteServiceType.Icon);

  @memorizeAsync(IconService.cacheContext)
  public async getCollection(): Promise<IconModelCollection> {
    return await this._iconRepository.invoke('getCollection');
  }

  @memorizeAsync(IconService.cacheContext)
  public async loadCharacterIcons(characterId: string): Promise<IconModel> {
    const icons = await this._iconRepository.invoke('getIconsByCharacterId', characterId);
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.loadVariantIcons(characterId, variantId)
    );
  }
  
  @memorizeAsync(IconService.cacheContext)
  public async loadVariantIcons(characterId: string, variantId: string) {
    const icons = await this._iconRepository.invoke('getIconsByVariantId', characterId, variantId);
    return reduceKeysAsync(Object.keys(icons), type => this.loadIcon(characterId, variantId, type));
  }

  @memorizeAsync(IconService.cacheContext)
  public async loadIcon(characterId: string, variantId: string, type: string): Promise<string> {
    const icon = await this._iconRepository.invoke('getIcon', characterId, variantId, type);
    return icon && await this._blobService.read(icon, BlobReadType.URL);
  }
}