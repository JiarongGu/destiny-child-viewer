import { sink, state, SinkFactory } from 'redux-sink';

import { MetadataService } from '@services/data/metadata-service';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

@sink('metadata', new MetadataService())
export class MetadataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];

  constructor(private _metadataService: MetadataService) { }

  public static async load() {
    const sink = SinkFactory.getSink(MetadataSink);
    await sink.loadCharacterInfo();
  }

  private async loadCharacterInfo() {
    this.characters = await this._metadataService.getCharacterMetadata();
    this.characterIndexes = Object.keys(this.characters).filter(key => key.startsWith('c'));
  }
}
