import { RemoteService, IIconRepository, RemoteServiceType } from '@shared/remote';
import { IconModel, IconModelCollection, reduceKeysAsync } from '@shared';
import { BlobService, BlobReadType } from '../blob';

export class IconService {
  private readonly _blobService = new BlobService();
  private readonly _iconRepository = new RemoteService<IIconRepository>(RemoteServiceType.Icon);

  public async listIcons(): Promise<IconModelCollection> {
    return await this._iconRepository.invoke('listIcons');
  }

  public async getCharacterIcons(characterId: string): Promise<IconModel> {
    const icons = await this._iconRepository.invoke('getCharacterIcons', characterId);
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.getVariantIcons(characterId, variantId)
    );
  }

  public async getVariantIcons(characterId: string, variantId: string) {
    const icons = await this._iconRepository.invoke('getVariantIcons', characterId, variantId);
    return reduceKeysAsync(Object.keys(icons), type => this.getIcon(characterId, variantId, type));
  }

  public async getIcon(characterId: string, variantId: string, type: string): Promise<string> {
    const icon = await this._iconRepository.invoke('getIcon', characterId, variantId, type);
    return icon && await this._blobService.read(icon, BlobReadType.URL);
  }
}