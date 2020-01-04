
import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { IIconRepository } from '@shared/remote';
import { IconModelCollection, IconModel, reduceKeysAsync } from '@shared';
import { FileLocator } from '../common';
import { IconInitializer } from './icon-initializer';

export class IconRepository implements IIconRepository {
  private readonly _modelAdapter: lowdb.AdapterAsync<IconModelCollection>;
  private readonly _iconInitializer: IconInitializer;

  private readonly _defaultVariantIcon = {
    home: 'asset/icon/portrait/00000_empty.png',
    battle: 'asset/icon/portrait_battle/10000_empty.png'
  }

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.ICON_STATIC);
    this._iconInitializer = new IconInitializer();
  }

  public async getCollection(): Promise<IconModelCollection> {
    return (await this.iconLowdb).value();
  }

  public async getIconsByCharacterId(characterId: string): Promise<IconModel> {
    const icons = (await this.iconLowdb).get(characterId).value();
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.getIconsByVariantId(characterId, variantId)
    );
  }

  public async getIconsByVariantId(characterId: string, variantId: string) {
    return await reduceKeysAsync(['home', 'battle', 'spa'], type => this.getIcon(characterId, variantId, type));
  }

  public async getIcon(characterId: string, variantId: string, type: string): Promise<string> {
    const character = (await this.iconLowdb).get(characterId).value();
    const variant = character[variantId];
    if (!variant) {
      return this._defaultVariantIcon[type];
    }
    return character[variantId][type];
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
    const modelCollection = await this._iconInitializer.getCollection();
    return db.defaults(modelCollection).write();
  }
}