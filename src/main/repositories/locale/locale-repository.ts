import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { LocaleType, LocaleModelCollection, FileReadType, getCacheContext, memorizeAsync } from '@shared';
import { FileService, PathService } from '@main/services';
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

  public getCharacterTitles(): Promise<string> {
    return this.readFile(LocaleType.CharacterTitles);
  }

  public getCharacterNames(): Promise<string> {
    return this.readFile(LocaleType.CharacterNames);
  }

  public getBgmDescriptions(): Promise<string> {
    return this.readFile(LocaleType.BgmDescriptions);
  }

  @memorizeAsync(getCacheContext(LocaleRepository.cacheName))
  private async readFile(type: LocaleType) {
    const db = await this.localeLowdb;
    const filePath = db.get(type).value();
    const assetPath = this._pathService.getResourcePath(filePath);
    return await this._fileService.get(assetPath, FileReadType.Text);
  }

  private get localeLowdb() {
    return lowdb(this._localeAdapter);
  }
}