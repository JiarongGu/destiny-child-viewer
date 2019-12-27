import { sink, state, SinkFactory } from 'redux-sink';

import { MetadataService, IconDataService } from '@services/data';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';

@sink('metadata', new MetadataService(), new IconDataService)
export class MetadataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];
  @state public iconPortrait: { [key: string]: string } = {};
  @state public iconPortraitBattle: { [key: string]: string } = {};

  constructor(
    private _metadataService: MetadataService,
    private _iconDataService: IconDataService,
  ) { }

  public static async load() {
    const sink = SinkFactory.getSink(MetadataSink);
    await sink.loadCharacterInfo();
  }

  private async loadCharacterInfo() {
    this.characters = await this._metadataService.getCharacterMetadata();
    this.characterIndexes = Object.keys(this.characters).filter(key => key.startsWith('c'));

    this.iconPortrait = await this._iconDataService.getPortraits();
    this.iconPortraitBattle = await this._iconDataService.getPortraitsBattle();
  }
}
