import { PathService } from './../../services/file/path-service';
import { sink, effect, state, SinkFactory } from 'redux-sink';

import { FileService, FileReadType } from '@services/file/file-service';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

@sink('metadata', new FileService(), new PathService())
export class MetadataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];

  constructor(private fileService: FileService, private pathService: PathService) {}

  public static async load() {
    const sink = SinkFactory.getSink(MetadataSink);
    await sink.loadCharacterInfo();
  }

  private async loadCharacterInfo() {
    const path = `asset/character/model_info.json`;
    this.characters = await this.fileService.get<CharacterModelInfoCollection>(path, FileReadType.Json);
    this.characterIndexes = Object.keys(this.characters).filter(key => key.startsWith('c'));
  }
}
