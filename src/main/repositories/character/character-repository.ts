import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';
import { diff } from 'deep-object-diff';

import {
  CharacterBase,
  CharacterTitleCollection,
  CharacterAdditionalCollection,
  CharacterModel,
  CharacterVariantModel,
  CharacterTitle,
  reduceKeys,
} from '@shared';

import { ICharacterRepository } from '@shared/remote';
import { CharacterTitleInitializer } from './character-title-initializer';
import { FileLocator } from '../common';

export class CharacterRepository implements ICharacterRepository {
  private readonly _characterBaseAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterBase }>;
  private readonly _characterAdditionalAdapter: lowdb.AdapterAsync<CharacterAdditionalCollection>;
  private readonly _characterTitleAdapter: lowdb.AdapterAsync<CharacterTitleCollection>;

  private readonly _characterTitleInitializer: CharacterTitleInitializer;

  constructor() {
    this._characterBaseAdapter = new FileAsync(FileLocator.CHILD_DATA);
    this._characterAdditionalAdapter = new FileAsync(FileLocator.CHILD_ADDITIONAL_DATA);
    this._characterTitleAdapter = new FileAsync(FileLocator.TITLE_DATE);

    this._characterTitleInitializer = new CharacterTitleInitializer();
  }

  public async ListCharacters(): Promise<{ [key: string]: CharacterModel }> {
    const base = (await this.characterBaseLowdb).value();
    const title = (await this.characterTitleLowdb).value();
    const additional = (await this.characterAdditionalLowdb).value();
    return _.merge({}, base, title, additional);
  }

  public async getCharacter(characterId: string): Promise<CharacterModel> {
    const base = await this.getCharacterBase(characterId);
    const lowdb = await this.characterAdditionalLowdb;
    const additional = lowdb.get(characterId).value();
    return _.merge({}, base, additional);
  }

  public async getCharacterBase(characterId: string): Promise<CharacterBase & CharacterTitle> {
    const base = (await this.characterBaseLowdb).get(characterId).value();
    const title = (await this.characterTitleLowdb).get(characterId).value();
    return _.merge({}, base, title);
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

  private get characterBaseLowdb() {
    return lowdb(this._characterBaseAdapter);
  }

  private get characterAdditionalLowdb() {
    return lowdb(this._characterAdditionalAdapter);
  }

  private get characterTitleLowdb() {
    return lowdb(this._characterTitleAdapter).then(db => {
      if (db.isEmpty().value()) {
        return this.populateTitleCollection(db).then(() => db);
      }
      return db;
    });
  }

  private async populateTitleCollection(db: lowdb.LowdbAsync<CharacterTitleCollection>) {
    const modelCollection = await this._characterTitleInitializer.createDefaultCollection();
    return db.defaults(modelCollection).write();
  }

  private async cleanAdditional() {
    const lowdb = await this.characterAdditionalLowdb;
    const collection = await this.cleanAdditionalCollection(lowdb);

    Object.keys(collection).forEach(characterId => {
      if (collection[characterId]) {
        lowdb.set(characterId, collection[characterId]).write();
      } else {
        lowdb.set(characterId, undefined).write();
      }
    })
  }

  private async cleanAdditionalCollection(db: lowdb.LowdbAsync<CharacterAdditionalCollection>) {
    const collection = (await this.characterAdditionalLowdb).value();
    const cleanup = reduceKeys(Object.keys(collection), characterId => {
      const character = collection[characterId];
      const variants = character.variants && reduceKeys(Object.keys(character.variants), (variantId) => {
        const variant = character.variants![variantId];
        const position = (variant as any).position || (variant as any).positions;
        return position && { positions: position };
      });
      const isValid = variants && Object.keys(variants)
        .some(variantId => variants[variantId] && variants[variantId].positions);
      return isValid && {
        variants
      } || undefined;
    });
    return cleanup;
  }
}