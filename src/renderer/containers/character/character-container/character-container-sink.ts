
import { sink, state, effect, trigger } from 'redux-sink';
import * as _ from 'lodash';

import { ChildDataService } from '@services/data';
import { FileService, FileReadType } from '@services';
import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { getCharacterId } from '@utils';
import { ChildDataModel } from '@models/data/child-data-model';

export interface CharacterGroup {
  id: string;
  data: ChildDataModel;
  icon: string;
}

@sink('character-container-component',new ChildDataService(), new FileService(), MetadataSink)
export class CharacterContainerSink {
  @state public characters: Array<CharacterGroup> = [];
  @state public grid = {
    height: 0,
    width: 0,
    row: 0,
    column: 0,
  };

  constructor(
    private _childData: ChildDataService,
    private _fileService: FileService,
    private _metadata: MetadataSink
  ) { }

  @trigger('metadata/loaded')
  public async load(loaded: boolean) {
    if (!loaded) return;

    const characters = this._metadata.characters;
    const characterIds = Object.keys(characters).filter(id => !id.startsWith('s'));
    
    const characterDetails = characterIds.map(id => {
      const ids = getCharacterId(id);
      const character = characters[id];
      const icon = this._metadata.iconPortrait[id];

      return {
        character,
        icon,
        id: ids.character,
        variant: ids.variant,
      }
    });

    const detailsGroup = _.groupBy(characterDetails, detail => detail.id);

    this.characters = await Promise.all(Object.keys(detailsGroup).map(async id => {
      const data = this._childData.getCharacter(id);
      const icon = await this._fileService.get(detailsGroup[id][0].icon, FileReadType.URL);
      return { id, data, icon };
    }));

    this.updateGrid(this.grid.height, this.grid.width, this.characters.length);
  }

  @effect updateGridBySize(height: number, width: number) {
    this.updateGrid(height, width, this.characters.length);
  }

  private updateGrid(height: number, width: number, count: number) {
    const column = Math.floor(width / 128);
    const row = Math.ceil(count / column);

    this.grid = Object.assign({}, this.grid, { column, row, height, width });
  }

}