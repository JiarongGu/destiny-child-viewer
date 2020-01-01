import { CharacterRepository, IconRepository, RenderModelRepository } from '@repositories';
import { CharacterMetadata } from '@models';

export class CharacterService {
  private _characterRepository: CharacterRepository;
  private _iconRepository: IconRepository;
  private _renderModelRepository: RenderModelRepository

  constructor() {
    this._characterRepository = new CharacterRepository();
    this._iconRepository = new IconRepository();
    this._renderModelRepository = new RenderModelRepository();
  }

  public async listCharacterMetadata(): Promise<Array<CharacterMetadata>> {
    const renderModels = await this._renderModelRepository.listRenderModels();
    const iconModels = await this._iconRepository.listIcons();
    const characters = await this._characterRepository.ListCharacters();
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
    const render = await this._renderModelRepository.getCharacterRenderModel(characterId);
    const icon = await this._iconRepository.getIcon(characterId);
    const character = await this._characterRepository.getCharacter(characterId);

    return {
      character,
      icon,
      render,
      id: characterId,
      variants: render && Object.keys(render)
    };
  }
}