import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { PathService } from '@services';
import { RepositoryFiles } from '../common';
import {
  CharacterBase,
  CharacterAdditional,
  CharacterModel,
  CharacterVariantModel
} from '@models/data/character-model';

export class CharacterRepository {
  private readonly _characterBaseAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterBase }>;
  private readonly _characterAdditionalAdapter: lowdb.AdapterAsync<{ [key: string]: CharacterAdditional }>;

  constructor() {
    const pathService = new PathService();
    this._characterBaseAdapter = new FileAsync(pathService.getDataPath(RepositoryFiles.CHILD));
    this._characterAdditionalAdapter = new FileAsync(pathService.getDataPath(RepositoryFiles.CHILD_ADDITIONAL));
  }

  public async getCharacter(characterId: string): Promise<CharacterModel> {
    const data = (await this.characterBaseLowdb).get(characterId).value();
    const additional = (await this.characterAdditionalLowdb).get(characterId).value();
    return _.merge({}, data, additional);
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
      icon: variant.icon,
    };
  }

  private get characterBaseLowdb() {
    return lowdb(this._characterBaseAdapter);
  }

  private get characterAdditionalLowdb() {
    return lowdb(this._characterAdditionalAdapter);
  }
}