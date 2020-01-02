import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import {
  CharacterBase,
  CharacterAdditional,
  CharacterAdditionalCollection,
  CharacterModel,
  CharacterVariantModel
} from '@models/data';
import { memorizeAsync } from '@decorators';
import { getCacheContext } from '@utils';
import { FileLocator } from '../common';

import { CharacterAdditionalInitializer } from './character-additional-initializer';

export class CharacterRepository {
  public static cacheName = 'character-repository';

  private readonly _characterBaseAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterBase }>;
  private readonly _characterAdditionalAdapter: lowdb.AdapterAsync<CharacterAdditionalCollection>;
  private readonly _characterAdditionalInitializer: CharacterAdditionalInitializer;

  constructor() {
    this._characterBaseAdapter = new FileAsync(FileLocator.CHILD_DATA);
    this._characterAdditionalAdapter = new FileAsync(FileLocator.CHILD_ADDITIONAL_DATA);
    this._characterAdditionalInitializer = new CharacterAdditionalInitializer();
  }

  public async ListCharacters(): Promise<{ [key: string]: CharacterModel }> {
    const base = (await this.characterBaseLowdb).value();
    const additional = (await this.characterAdditionalLowdb).value();
    return _.merge({}, base, additional);
  }

  @memorizeAsync(getCacheContext(CharacterRepository.cacheName), 'character')
  public async getCharacter(characterId: string): Promise<CharacterModel> {
    const base = (await this.characterBaseLowdb).get(characterId).value();
    const additional = (await this.characterAdditionalLowdb).get(characterId).value();
    return _.merge({}, base, additional);
  }

  @memorizeAsync(getCacheContext(CharacterRepository.cacheName))
  public async getCharacterVariant(characterId: string, variantId: string): Promise<CharacterVariantModel> {
    const character = await this.getCharacter(characterId);
    const variant = character.variants[variantId];

    return {
      characterId,
      variantId,
      name: character.name,
      title: variant.title,
      type: character.type,
      stars: character.stars,
      positions: variant.positions,
    };
  }

  public async saveCharacter(characterId: string, model: CharacterModel) {
    (await this.characterAdditionalLowdb).set(characterId, model).write();
    const cache = getCacheContext(CharacterRepository.cacheName).main.get('character');
    if (cache) {
      cache.delete(characterId);
    }
  }

  private get characterBaseLowdb() {
    return lowdb(this._characterBaseAdapter);
  }

  private get characterAdditionalLowdb() {
    return lowdb(this._characterAdditionalAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populateAdditional(db).then(() => db);
      }
      return db;
    });
  }

  private async populateAdditional(db: lowdb.LowdbAsync<CharacterAdditionalCollection>) {
    const modelCollection = await this._characterAdditionalInitializer.createDefaultCollection();
    return db.defaults(modelCollection).write();
  }
}