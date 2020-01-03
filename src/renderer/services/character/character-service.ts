import { CharacterMetadata } from '@models';
import { RenderModelPositionType, CharacterVariantPosition } from '@shared';
import { ICharacterRepository, IRenderRepository, RemoteService, RemoteServiceType } from '@shared/remote';

import { IconService } from '../icon';

export class CharacterService {
  private readonly _characterRepository: RemoteService<ICharacterRepository>;
  private readonly _renderRepository: RemoteService<IRenderRepository>;;
  private readonly _iconService: IconService;

  constructor() {
    this._characterRepository = new RemoteService(RemoteServiceType.Character);
    this._renderRepository = new RemoteService(RemoteServiceType.Render);
    this._iconService = new IconService();
  }

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

  public async getCharacterMetadata(characterId: string): Promise<CharacterMetadata> {
    const render = await this._renderRepository.invoke('getCharacterRenderModel', characterId);
    const character = await this._characterRepository.invoke('getCharacter', characterId);
    const icon = await this._iconService.getCharacterIcons(characterId);

    return {
      character,
      icon,
      render,
      id: characterId,
      variants: render && Object.keys(render)
    };
  }

  public getCharacterIcon(characterId: string) {
    return this._iconService.getCharacterIcons(characterId);
  }

  public async getIcon(characterId: string, variantId: string, type: string) {
    return await this._iconService.getIcon(characterId, variantId, type);
  }

  public async savePosition(
    characterId: string, variantId: string, positionType: RenderModelPositionType, position: CharacterVariantPosition
  ) {
    const character = await this._characterRepository.invoke('getCharacter', characterId);
    character.variants[variantId].positions[positionType] = { ...position, refined: true };
    await this._characterRepository.invoke('saveCharacter', characterId, character);
  }
}