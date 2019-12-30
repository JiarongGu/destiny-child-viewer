import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services';

export class VoiceDataService {
  private _pathService: PathService;

  constructor() {
    this._pathService = new PathService;
  }

  public getCharacterVoices() {
    const dir = this._pathService.getAssetPath('sound/voice');
  }
}