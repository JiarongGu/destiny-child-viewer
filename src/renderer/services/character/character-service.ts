import { CharacterModel } from '@shared/models';
import { CharacterMetadata } from '@models';
import { RenderModelPositionType, CharacterVariantPosition, getCacheContext, memorizeAsync } from '@shared';
import { ICharacterRepository, IRenderRepository, RemoteService, RemoteServiceType } from '@shared/remote';

import { IconService } from '../icon';

export class CharacterService {
  public static cacheContext = getCacheContext('character-service');

  private readonly _characterRepository: RemoteService<ICharacterRepository>;
  private readonly _renderRepository: RemoteService<IRenderRepository>;;
  private readonly _iconService: IconService;

  constructor() {
    this._characterRepository = new RemoteService(RemoteServiceType.Character);
    this._renderRepository = new RemoteService(RemoteServiceType.Render);
    this._iconService = new IconService();
  }
  
  @memorizeAsync(CharacterService.cacheContext)
  public async listCharacterMetadata(): Promise<Array<CharacterMetadata>> {
    const renderModels = await this._renderRepository.invoke('listRenderModels');
    const characters = await this._characterRepository.invoke('ListCharacters');
    const iconModels = await this._iconService.listIcons();
    const characterIds = Object.keys(renderModels).filter(id => !id.startsWith('s'));

    return characterIds.map(id => ({
      id,
      character: characters[id],
      icon: iconModels[id],
      render: renderModels[id],
      variants: Object.keys(renderModels[id])
    }));
  }
  
  @memorizeAsync(CharacterService.cacheContext)
  public async getCharacterMetadata(characterId: string): Promise<CharacterMetadata> {
    const render = await this._renderRepository.invoke('getCharacterRenderModel', characterId);
    const character = await this._characterRepository.invoke('getCharacter', characterId);
    const icon = await this._iconService.loadCharacterIcons(characterId);

    return {
      character,
      icon,
      render,
      id: characterId,
      variants: render && Object.keys(render)
    };
  }

  public async savePosition(
    characterId: string, variantId: string, positionType: RenderModelPositionType, position: CharacterVariantPosition
  ) {
    const character = (await this.getCharacterMetadata(characterId)).character;
    character.variants[variantId].positions[positionType] = { ...position, refined: true };
    await this.saveCharacter(characterId, character);
  }

  public async saveCharacter(characterId: string, character: CharacterModel) {
    await this._characterRepository.invoke('saveCharacter', characterId, character);
    this.clearCharacterCache(characterId);
  }

  private clearCharacterCache(characterId: string) {
    const characterCache = CharacterService.cacheContext.get(this.getCharacterMetadata.name);
    if (characterCache) {
      characterCache.delete(characterId);
    }
  }
}