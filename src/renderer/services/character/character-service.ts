import { CharacterMetadata } from '@models';
import { RenderModelPositionType, CharacterModel, VariantPosition } from '@shared';
import { ICharacterRepository, IRenderRepository, RemoteService, RemoteServiceType } from '@shared/remote';
import { IconService } from '../icon/icon-service';
import { MemorizeContext, memorizeAsync } from 'ts-memorize-decorator';

export class CharacterService {
  public static cacheContext = new MemorizeContext();

  private readonly _characterRepository: RemoteService<ICharacterRepository>;
  private readonly _renderRepository: RemoteService<IRenderRepository>;;
  private readonly _iconService: IconService;

  constructor() {
    this._characterRepository = new RemoteService(RemoteServiceType.Character);
    this._renderRepository = new RemoteService(RemoteServiceType.Render);
    this._iconService = new IconService();
  }

  @memorizeAsync(CharacterService.cacheContext)
  public async listAll(): Promise<Array<CharacterMetadata>> {
    const renderModels = await this._renderRepository.invoke('getCollection');
    const characters = await this._characterRepository.invoke('getCollection');

    const iconModels = await this._iconService.getCollection();
    const characterIds = Object.keys(renderModels).filter(id => !id.startsWith('s')).sort();

    return characterIds.map((id, index) => ({
      id,
      character: characters[id],
      icon: iconModels[id],
      render: renderModels[id],
      variants: Object.keys(renderModels[id]),
      orderIndex: index
    }));
  }

  @memorizeAsync(CharacterService.cacheContext)
  public async getCharacterMetadata(characterId: string): Promise<CharacterMetadata> {
    const render = await this._renderRepository.invoke('getRendersByCharacterId', characterId);
    const character = await this._characterRepository.invoke('getCharacter', characterId);
    const icon = await this._iconService.loadCharacterIcons(characterId);
    const orderIndex = (await this.listAll()).find(x => x.id === characterId)?.orderIndex;

    return {
      character,
      icon,
      render,
      id: characterId,
      variants: render && Object.keys(render),
      orderIndex: orderIndex || 0
    };
  }

  public async savePosition(
    characterId: string, variantId: string, positionType: RenderModelPositionType, position: VariantPosition
  ) {
    const character = (await this.getCharacterMetadata(characterId)).character;
    const positionValue = { ...position, refined: true };

    if (!character.variants[variantId].positions) {
      character.variants[variantId].positions = { [positionType]: positionValue };
    } else {
      character.variants[variantId].positions[positionType] = positionValue;
    }
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