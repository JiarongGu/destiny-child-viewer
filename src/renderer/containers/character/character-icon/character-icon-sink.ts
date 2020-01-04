import { sink, state, effect } from 'redux-sink';

import { CharacterMetadata } from '@models';
import { CharacterService, IconService } from '@services';

export interface IconGrid {
  height: number,
  width: number,
  row: number,
  column: number,
}

@sink('character-icon', new CharacterService(), new IconService())
export class CharacterIconSink {
  @state public characters: Array<CharacterMetadata> = [];
  @state public grid: IconGrid = { height: 0, width: 0, row: 0, column: 0 };
  @state public scrollTop: number = 0;

  constructor(
    private _characterService: CharacterService,
    private _iconService: IconService
  ) { }

  @effect
  public async load() {
    if (this.characters.length === 0) {
      this.characters = await this._characterService.listAll();
      this.updateGrid(this.grid.height, this.grid.width, this.characters.length);
    }
  }

  @effect
  public updateGridBySize(height: number, width: number) {
    this.updateGrid(height, width, this.characters.length);
  }

  @effect
  public getIcon(characterId: string, variantId: string, type: string) {
    return this._iconService.loadIcon(characterId, variantId, type);
  }

  private updateGrid(height: number, width: number, count: number) {
    const column = Math.floor(width / 128);
    const row = Math.ceil(count / column);

    this.grid = Object.assign({}, this.grid, { column, row, height, width });
  }

}