import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services/path-service';
import { IconModelCollection, IconModel } from '@models/data';

import { RepositoryFiles } from '../common';
import { IconCollectionInitializer } from './icon-collection-initializer';

export class IconRepository {
  public static cacheName = 'icon-repository';

  private readonly _modelAdapter: lowdb.AdapterAsync<IconModelCollection>;
  private readonly _iconCollectionInitializer: IconCollectionInitializer;

  constructor() {
    const pathService = new PathService();
    this._modelAdapter = new FileAsync(pathService.getDataPath(RepositoryFiles.ICON));
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