import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { memorizeAsync } from '@decorators';
import { getCacheContext } from '@utils';
import { LocaleType, LocaleModelCollection } from '@models/data';
import { PathService } from '@services/path-service';
import { FileService, FileReadType } from '@services/file-service';
import { FileLocator } from '../common';

export class LocaleRepository {
  public static cacheName = 'locale-repository';

  private readonly _localeAdapter: lowdb.AdapterAsync<LocaleModelCollection>;
  private readonly _pathService: PathService;
  private readonly _fileService: FileService;

  constructor() {
    this._localeAdapter = new FileAsync(FileLocator.LOCALE_DATA);
    this._fileService = new FileService();
    this._pathService = new PathService();
  }


  public getCharacterTitlesFile(): Promise<string> {
    return this.readFile(LocaleType.CharacterTitles);
  }

  public getCharacterNamesFile(): Promise<string> {
    return this.readFile(LocaleType.CharacterNames);
  }
  
  @memorizeAsync(getCacheContext(LocaleRepository.cacheName))
  private async readFile(type: LocaleType) {
    const db = await this.localeLowdb;
    const filePath = db.get(type).value();
    const assetPath = this._pathService.getAssetPath(filePath);
    return await this._fileService.get(assetPath, FileReadType.Text);
  }

  private get localeLowdb() {
    return lowdb(this._localeAdapter);
  }
}