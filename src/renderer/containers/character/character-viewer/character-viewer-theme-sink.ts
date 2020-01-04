import { sink, state, effect } from 'redux-sink';
import * as _ from 'lodash';

import { ThemeService, BlobService, BlobReadType } from '@services';
import { MusicModel } from '@shared';

@sink('character-viewer-theme', new ThemeService(), new BlobService())
export class CharacterViewerThemeSink {
  @state public musics: { [key: string]: MusicModel } = {};
  @state public sound?: string;

  constructor(
    private _themeService: ThemeService,
    private _blobService: BlobService
  ) {}

  @effect
  public async loadMetadata() {
    this. musics = await this._themeService.getMusicCollection();
  }

  @effect
  public async loadSound(file: string) {
    this.sound = await this._blobService.read(file, BlobReadType.URL);
  }
}