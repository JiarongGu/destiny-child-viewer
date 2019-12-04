import { sink, effect, state } from 'redux-sink';

import { FileService, FileReadType } from '@services/file/file-service';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

@sink('gameData', new FileService())
export class GameDataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];

  constructor(private fileService: FileService) {}

  @effect
  public async load() {
    await this.loadCharacterInfo();
  }

  private async loadCharacterInfo() {
    const path = `asset/character/model_info.json`;
    this.characters = await this.fileService.get<CharacterModelInfoCollection>(path, FileReadType.Json);
    this.characterIndexes = Object.keys(this.characters).filter(key => key.startsWith('c'));
  }
}
