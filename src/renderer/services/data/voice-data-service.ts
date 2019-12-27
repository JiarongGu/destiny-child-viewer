import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services';
import { MetadataService } from './metadata-service';
import { readdir } from '@utils';

export class VoiceDataService {
  private _pathService: PathService;
  private _metadataService: MetadataService;

  constructor() {
    this._pathService = new PathService;
    this._metadataService = new MetadataService();
  }

  public getCharacterVoices() {
    const dir = this._pathService.getAssetPath('sound/voice');
    const files = readdir(dir);
    
  }
}