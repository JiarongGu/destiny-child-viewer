
import { sink, state, effect } from 'redux-sink';

import { CharacterMetadata } from '@models/character/character-metadata';
import { CharacterService } from '@services/character-service';

export interface IconGrid {
  height: number,
  width: number,
  row: number,
  column: number,
}

@sink('character-icon', new CharacterService())
export class CharacterIconSink {
  @state public characters: Array<CharacterMetadata> = [];
  @state public grid: IconGrid = { height: 0, width: 0, row: 0, column: 0 };

  constructor( private _characterService: CharacterService) { }

  @effect
  public async load() {
    this.characters = await this._characterService.listCharacterMetadata();
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