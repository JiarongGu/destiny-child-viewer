import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { BgmCollection, BgmModel } from '@models/data';

import { FileLocator } from '../common';
import { BgmCollectionInitializer } from './bgm-collection-initializer';

export class BgmRepository {
  public static cacheName = 'icon-repository';

  private readonly _modelAdapter: lowdb.AdapterAsync<BgmCollection>;
  private readonly _bgmCollectionInitializer: BgmCollectionInitializer;

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.SOUND_DATA);
    this._bgmCollectionInitializer = new BgmCollectionInitializer();
  }

  public async listBgms(): Promise<BgmCollection> {
    const db = await this.bgmLowdb;
    return db.value();
  }

  public async getBgm(id: number): Promise<BgmModel> {
    const db = await this.bgmLowdb;
    return db.get(id).value();
  }

  private get bgmLowdb() {
    return lowdb(this._modelAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populateIcons(db).then(() => db);
      }
      return db;
    });
  }

  private async populateIcons(db: lowdb.LowdbAsync<BgmCollection>) {
    const modelCollection = await this._bgmCollectionInitializer.createDefaultCollection();
    return db.defaults(modelCollection).write();
  }
}