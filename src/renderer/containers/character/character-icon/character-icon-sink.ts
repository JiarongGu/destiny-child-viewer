import { sink, state, trigger, effect } from 'redux-sink';

import { MetadataSink } from '@sinks';
import { CharacterGroup } from '@models/character/character-group';

export interface IconGrid {
  height: number,
  width: number,
  row: number,
  column: number,
}

@sink('character-icon', MetadataSink)
export class CharacterIconSink {
  @state public characters: Array<CharacterGroup> = [];
  @state public grid: IconGrid = { height: 0, width: 0, row: 0, column: 0 };

  constructor(private _metadata: MetadataSink) { }

  @trigger('metadata/loaded')
  public async load(loaded: boolean) {
    if (!loaded) return;
    this.characters = Object.keys(this._metadata.characterDetails).map(key => this._metadata.characterDetails[key]);
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