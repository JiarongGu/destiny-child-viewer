import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { IconModelCollection, IconModel } from '@models/data';
import { FileService, FileReadType } from '@services/file-service';
import { PathService } from '@services/path-service';
import { getCacheContext, reduceKeysAsync } from '@utils';

import { FileLocator } from '../common';
import { IconCollectionInitializer } from './icon-collection-initializer';
import { memorizeAsync } from '@decorators';

export class IconRepository {
  public static cacheContext = getCacheContext('icon-repository');

  private readonly _modelAdapter: lowdb.AdapterAsync<IconModelCollection>;
  private readonly _iconCollectionInitializer: IconCollectionInitializer;
  private readonly _pathService = new PathService;
  private readonly _fileService = new FileService();

  constructor() {
    this._modelAdapter = new FileAsync(FileLocator.ICON_DATA);
    this._iconCollectionInitializer = new IconCollectionInitializer();
  }

  public async listIcons(): Promise<IconModelCollection> {
    return (await this.iconLowdb).value();
  }

  @memorizeAsync(IconRepository.cacheContext, 'character-icons')
  public async getCharacterIcons(characterId: string): Promise<IconModel> {
    const icons = (await this.iconLowdb).get(characterId).value();
    return icons && await reduceKeysAsync(Object.keys(icons),
      variantId => this.getVariantIcons(characterId, variantId)
    );
  }

  @memorizeAsync(IconRepository.cacheContext, 'variant-icons')
  public getVariantIcons(characterId: string, variantId: string) {
    return reduceKeysAsync(['home', 'battle', 'spa'], type => this.getIcon(characterId, variantId, type));
  }

  @memorizeAsync(IconRepository.cacheContext, 'icon')
  public async getIcon(characterId: string, variantId: string, type: string): Promise<string> {
    const character = (await this.iconLowdb).get(characterId).value();
    const icon = character[variantId][type];
    return icon && await this._fileService.get(this._pathService.getAssetPath(icon), FileReadType.URL);
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