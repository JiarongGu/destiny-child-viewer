import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { memorizeAsync } from '@decorators';
import { getCacheContext } from '@utils';
import { FileLocator } from '../common';

export class CharacterRepository {
  public static cacheName = 'character-repository';

  private readonly _localeAdapter: lowdb.AdapterAsync<{ [key: string]: string }>;

  constructor() {
    this._localeAdapter = new FileAsync(FileLocator.LOCALE_DATA);
  }
  
  private get localeLowdb() {
    return lowdb(this._localeAdapter);
  }
}