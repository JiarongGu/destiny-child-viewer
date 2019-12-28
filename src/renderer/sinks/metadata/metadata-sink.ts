
import { sink, state, SinkFactory } from 'redux-sink';
import * as _ from 'lodash';

import { MetadataService, IconDataService, ChildDataService } from '@services/data';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';
import { CharacterGroup } from '@models/character/character-group';
import { getCharacterId } from '@utils';

@sink('metadata', new MetadataService(), new IconDataService(), new ChildDataService)
export class MetadataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];
  @state public iconPortrait: { [key: string]: string } = {};
  @state public iconPortraitBattle: { [key: string]: string } = {};
  @state public characterDetails: Array<CharacterGroup> = [];

  @state public loaded: boolean = false;

  constructor(
    private _metadataService: MetadataService,
    private _iconDataService: IconDataService,
    private _childDataService: ChildDataService
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

    this.characterDetails = this.loadCharacterDetails(this.characters, this.iconPortrait);

    this.loaded = true;
  }

  private loadCharacterDetails(
    characters: CharacterModelInfoCollection, iconPortrait: { [key: string]: string }
  ): Array<CharacterGroup> {
    const characterIds = Object.keys(characters).filter(id => !id.startsWith('s'));

    const characterDetails = characterIds.map(id => {
      const ids = getCharacterId(id);
      const character = characters[id];
      const icon = iconPortrait[id];
      return { character, icon, id: ids.character, variant: ids.variant };
    });

    const detailsGroup = _.groupBy(characterDetails, detail => detail.id);

    return Object.keys(detailsGroup).map(id => {
      const data = this._childDataService.getCharacter(id);
      const icon = detailsGroup[id][0].icon;
      return { id, data, icon };
    });
  }
}
