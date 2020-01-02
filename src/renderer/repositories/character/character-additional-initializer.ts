import * as _ from 'lodash';

import { reduceMap, reduceKeys, LocaleHelper } from '@utils';
import { CharacterHelper, CharacterIdentifiers } from './../common/character-helper';
import { LocaleRepository } from '../locale/locale-repository';

interface CharacterTitle {
  characterId: string;
  variantId: string;
  title: string;
  description: string;
}

interface CharacterName {
  characterId: string;
  variantId: string;
  name: string;
}

export class CharacterAdditionalInitializer {
  private readonly _localeRepository = new LocaleRepository();

  public async createDefaultCollection() {
    const titles = _.groupBy(await this.getCharacterTitleModels(), title => title.characterId);
    const names = _.groupBy(await this.getCharacterNameModels(), name => name.characterId);

    return _.merge(
      reduceKeys(Object.keys(titles), (key) => ({
        variants: reduceMap(titles[key], variant => variant.variantId, variant => ({
          title: variant.title,
          description: variant.description
        }))
      })),
      reduceKeys(Object.keys(names), (key) => ({
        variants: reduceMap(names[key], variant => variant.variantId, variant => ({ 
          name: variant.name 
        }))
      }))
    );
  }

  private async getCharacterTitleModels(): Promise<Array<CharacterTitle>> {
    const file = await this._localeRepository.getCharacterTitles();
    return LocaleHelper.formatFile(file, (blocks) => {
      const identifiers = CharacterHelper.getCharacterIdentifiers(blocks[0]);
      return {
        characterId: identifiers.characterId,
        variantId: identifiers.variantId,
        title: blocks[1],
        description: blocks[2]
      }
    });
  }

  private async getCharacterNameModels(): Promise<Array<CharacterName>> {
    const file = await this._localeRepository.getCharacterNames();
    return LocaleHelper.formatFile(file, (blocks) => {
      const identifiers = CharacterHelper.getCharacterIdentifiers(blocks[0]);
      return {
        characterId: identifiers.characterId,
        variantId: identifiers.variantId,
        name: blocks[1]
      }
    });
  }
}