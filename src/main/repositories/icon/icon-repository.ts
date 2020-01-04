import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { IconModelCollection, IconModel, reduceKeysAsync } from '@shared';
import { PathService } from '@main/services';

import { FileLocator } from '../common';
import { IconCollectionInitializer } from './icon-collection-initializer';

export class IconRepository {
  private readonly _modelAdapter: lowdb.AdapterAsync<IconModelCollection>;
  private readonly _iconCollectionInitializer: IconCollectionInitializer;
  private readonly _pathService: PathService;
  private readonly _defaultVariantIcon = {
    home: 'asset/icon/portrait/00000_empty.png',
    battle: 'asset/icon/portrait_battle/10000_empty.png'
  }

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.ICON_DATA);
    this._iconCollectionInitializer = new IconCollectionInitializer();
    this._pathService = new PathService();
  }
  
  public async listIcons(): Promise<IconModelCollection> {
    return (await this.iconLowdb).value();
  }

  public async getCharacterIcons(characterId: string): Promise<IconModel> {
    const icons = (await this.iconLowdb).get(characterId).value();
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.getVariantIcons(characterId, variantId)
    );
  }

  public getVariantIcons(characterId: string, variantId: string) {
    return reduceKeysAsync(['home', 'battle', 'spa'], type => this.getIcon(characterId, variantId, type));
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
    const modelCollection = await this._iconCollectionInitializer.createDefaultCollection();
    return db.defaults(modelCollection).write();
  }
}