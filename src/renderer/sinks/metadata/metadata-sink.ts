
import { sink, state, SinkFactory } from 'redux-sink';
import * as _ from 'lodash';

import { MetadataService, IconDataService, ChildDataService } from '@services/data';
import { CharacterModelInfoCollection } from '@models/character/character-model-info';
import { CharacterGroup } from '@models/character/character-group';
import { getCharacterId, reduceKeys } from '@utils';

type IconData = {
  [key: string]: {
    [key: string]: string
  }
};

@sink('metadata', new MetadataService(), new IconDataService(), new ChildDataService)
export class MetadataSink {
  @state public characters: CharacterModelInfoCollection = {};
  @state public characterIndexes: Array<string> = [];
  @state public iconPortrait: IconData = {};
  @state public iconPortraitBattle: IconData = {};
  @state public characterDetails: { [key: string]: CharacterGroup } = {};

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
    this.characterIndexes = Object.keys(this.characters).filter(key => !key.startsWith('s'));

    this.iconPortrait = await this._iconDataService.getPortraits();
    this.iconPortraitBattle = await this._iconDataService.getPortraitsBattle();

    this.characterDetails = this.loadCharacterDetails(this.characters, this.iconPortrait);

    this.loaded = true;
  }

  private loadCharacterDetails(characters: CharacterModelInfoCollection, iconPortrait: IconData) {
    const characterIds = Object.keys(characters).filter(id => !id.startsWith('s'));

    const characterDetails = characterIds.map(id => {
      const ids = getCharacterId(id);
      const character = characters[id];
      const icon = iconPortrait[ids.character][ids.variant];
      return { character, icon, id: ids.character, variant: ids.variant };
    });

    const detailsGroup = _.groupBy(characterDetails, detail => detail.id);
    const keys = Object.keys(detailsGroup);

    return reduceKeys<CharacterGroup, string>(keys, id => {
      const data = this._childDataService.getCharacter(id);
      const defaultDetail = detailsGroup[id].find(x => x.variant === '01');
      const live2dDefault = {
        icon: defaultDetail?.icon || detailsGroup[id][0].icon,
        variant: defaultDetail?.variant || detailsGroup[id][0].variant
      }
      const live2ds = detailsGroup[id].map(detail => {
        const variant = detail.variant;
        const icon = detail.icon;
        return { variant, icon };
      });
      return { id, data, live2dDefault, live2ds };
    });
  }
}
