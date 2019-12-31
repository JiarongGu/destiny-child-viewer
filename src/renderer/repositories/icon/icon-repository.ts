import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { IconModelCollection, IconModel } from '@models/data';

import { FileLocator } from '../common';
import { IconCollectionInitializer } from './icon-collection-initializer';

export class IconRepository {
  public static cacheName = 'icon-repository';

  private readonly _modelAdapter: lowdb.AdapterAsync<IconModelCollection>;
  private readonly _iconCollectionInitializer: IconCollectionInitializer;

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.ICON_DATA);
    this._iconCollectionInitializer = new IconCollectionInitializer();
  }

  public async listIcons(): Promise<IconModelCollection> {
    const db = await this.iconLowdb;
    return db.value();
  }

  public async getIcon(characterId: string): Promise<IconModel> {
    const db = await this.iconLowdb;
    return db.get(characterId).value();
  }

  private get iconLowdb() {
    return lowdb(this._modelAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populateIcons(db).then(() => db);
      }
      return db;
    });
  }

  private async populateIcons(db: lowdb.LowdbAsync<IconModelCollection>) {
    const modelCollection = await this._iconCollectionInitializer.createDefaultCollection();
    return db.defaults(modelCollection).write();
  }
}