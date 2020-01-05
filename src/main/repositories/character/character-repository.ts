import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';
import { diff } from 'deep-object-diff';

import {
  CharacterBase,
  CharacterStatic,
  CharacterAdditional,
  CharacterModel,
  CharacterVariantModel,
} from '@shared';

import { ICharacterRepository } from '@shared/remote';
import { CharacterInitializer } from './character-initializer';
import { FileLocator } from '../common';

export class CharacterRepository implements ICharacterRepository {
  private readonly _characterBaseAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterBase }>;
  private readonly _characterAdditionalAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterAdditional }>;
  private readonly _characterStaticAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterStatic }>;

  private readonly _characterInitializer: CharacterInitializer;

  constructor() {
    this._characterBaseAdapter = new FileAsync(FileLocator.CHILD_STATIC);
    this._characterStaticAdapter = new FileAsync(FileLocator.CHARACTER_STATIC);
    this._characterAdditionalAdapter = new FileAsync(FileLocator.CHARACTER_DATA);

    this._characterInitializer = new CharacterInitializer();
  }

  public async getCollection(): Promise<{ [key: string]: CharacterModel }> {
    const base = (await this.characterBaseLowdb).value();
    const other = (await this.characterStaticLowdb).value();
    const additional = (await this.characterAdditionalLowdb).value();
    return _.merge({}, base, other, additional);
  }

  public async getCharacter(characterId: string): Promise<CharacterModel> {
    const base = await this.getCharacterBase(characterId);
    const lowdb = await this.characterAdditionalLowdb;
    const additional = lowdb.get(characterId).value();
    return _.merge({}, base, additional);
  }

  public async saveCharacter(characterId: string, model: CharacterModel) {
    const base = await this.getCharacterBase(characterId);
    const lowdb = await this.characterAdditionalLowdb;
    const update = diff(base, model);
    await lowdb.set(characterId, update).write();
  }

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

  private async getCharacterBase(characterId: string): Promise<CharacterModel> {
    const base = (await this.characterBaseLowdb).get(characterId).value();
    const other = (await this.characterStaticLowdb).get(characterId).value();
    return _.merge({}, base, other);
  }

  private get characterBaseLowdb() {
    return lowdb(this._characterBaseAdapter);
  }

  private get characterAdditionalLowdb() {
    return lowdb(this._characterAdditionalAdapter);
  }

  private get characterStaticLowdb() {
    return lowdb(this._characterStaticAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populate(db).then(() => db);
      }
      return db;
    });
  }

  private async populate(db: lowdb.LowdbAsync<{ [key: string]: CharacterStatic }>) {
    const modelCollection = await this._characterInitializer.getStaticCollection();
    return db.defaults(modelCollection).write();
  }
}