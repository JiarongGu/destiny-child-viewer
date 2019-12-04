import { sink, effect, state } from 'redux-sink';

import { FileService, FileReadType } from '@services/file/file-service';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

import * as FileSync from 'lowdb/adapters/FileSync';

@sink('saveData', new FileService())
export class GameDataSink {
  @state public children: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];

  constructor(private fileService: FileService) {}

  @effect
  public async load() {
    await this.loadCharacterInfo();
  }

  private async loadCharacterInfo() {
    const filePath = this.fileService.getResourcePath('data/children.json');
    const adapter = new FileSync(filePath);
  }
}
