import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services/path-service';
import {
  CharacterBase,
  CharacterAdditional,
  CharacterModel,
  CharacterVariantModel
} from '@models/data';
import { memorizeAsync } from '@decorators';
import { getCacheContext } from '@utils';

import { RepositoryFiles } from '../common';

export class CharacterRepository {
  public static cacheName = 'character-repository';

  private readonly _characterBaseAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterBase }>;
  private readonly _characterAdditionalAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterAdditional }>;

  constructor() {
    const pathService = new PathService();
    this._characterBaseAdapter = new FileAsync(pathService.getDataPath(RepositoryFiles.CHILD));
    this._characterAdditionalAdapter = new FileAsync(pathService.getDataPath(RepositoryFiles.CHILD_ADDITIONAL));
  }

  public async ListCharacters(): Promise<{ [key: string]: CharacterModel }> {
    const base = (await this.characterBaseLowdb).value();
    const additional = (await this.characterAdditionalLowdb).value();
    return _.merge({}, base, additional);
  }

  @memorizeAsync(getCacheContext(CharacterRepository.cacheName))
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

  private get characterBaseLowdb() {
    return lowdb(this._characterBaseAdapter);
  }

  private get characterAdditionalLowdb() {
    return lowdb(this._characterAdditionalAdapter);
  }
}