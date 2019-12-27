import { FileService, FileReadType, PathService } from '@services';
import { memorizeAsync } from '@decorators';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

export class MetadataService {
  private _fileService: FileService;
  private _pathService: PathService

  constructor() {
    this._fileService = new FileService();
    this._pathService = new PathService();  
  }

  @memorizeAsync
  public async getCharacterMetadata(): Promise<CharacterModelInfoCollection> {
    const path = this._pathService.getAssetPath('/character/model_info.json');
    return await this._fileService.get<CharacterModelInfoCollection>(path, FileReadType.Json);
  }
}
