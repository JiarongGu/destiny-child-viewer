import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { ThemeCollection, MusicModel } from '@shared/models';
import { IThemeRepository } from '@shared/remote';

import { FileLocator } from '../common';
import { ThemeInitializer } from './theme-initializer';

export class ThemeRepository implements IThemeRepository {
  private readonly _modelAdapter: lowdb.AdapterAsync<ThemeCollection>;
  private readonly _themeInitializer: ThemeInitializer;

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.THEME_STATIC);
    this._themeInitializer = new ThemeInitializer();
  }

  public async getMusicCollection(): Promise<{ [key: number]: MusicModel }> {
    const db = await this.themeLowdb;
    return db.get('musics').value();
  }

  public async getMusic(id: number): Promise<MusicModel> {
    const db = await this.themeLowdb;
    return db.get(id).value();
  }

  private get themeLowdb() {
    return lowdb(this._modelAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populate(db).then(() => db);
      }
      return db;
    });
  }

  private async populate(db: lowdb.LowdbAsync<ThemeCollection>) {
    const modelCollection = await this._themeInitializer.getCollection();
    return db.defaults(modelCollection).write();
  }
}