import { FileService } from './file-service';
import { PathService } from './path-service';
import { CharacterRepository, IconRepository, RenderModelRepository } from '@repositories';
import { CharacterMetadata } from '@models';
import { RenderModelPositionType, CharacterVariantPosition } from '@models/data';

export class CharacterService {
  private readonly _characterRepository: CharacterRepository;
  private readonly _iconRepository: IconRepository;
  private readonly _renderModelRepository: RenderModelRepository;
  private readonly _pathService: PathService;
  private readonly _fileService: FileService;

  constructor() {
    this._characterRepository = new CharacterRepository();
    this._iconRepository = new IconRepository();
    this._renderModelRepository = new RenderModelRepository();
    this._pathService = new PathService();
    this._fileService = new FileService();
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
    const icon = await this._iconRepository.getCharacterIcons(characterId);
    const character = await this._characterRepository.getCharacter(characterId);

    return {
      character,
      icon,
      render,
      id: characterId,
      variants: render && Object.keys(render)
    };
  }

  public getCharacterIcon(characterId: string) {
    return this._iconRepository.getCharacterIcons(characterId);
  }

  public async getIcon(characterId: string, variantId: string, type: string) {
    return await this._iconRepository.getIcon(characterId, variantId, type);
  }

  public async savePosition(
    characterId: string, variantId: string, positionType: RenderModelPositionType, position: CharacterVariantPosition
  ) {
    const character = await this._characterRepository.getCharacter(characterId);
    character.variants[variantId].positions[positionType] = { ...position, refined: true };
    await this._characterRepository.saveCharacter(characterId, character);
  }
}