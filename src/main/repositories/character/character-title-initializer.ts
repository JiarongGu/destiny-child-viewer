import * as _ from 'lodash';

import { reduceMap, reduceKeys, LocaleHelper } from '@shared/utils';
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

export class CharacterTitleInitializer {
  private readonly _localeRepository = new LocaleRepository();

  public async createDefaultCollection() {
    const titles = _.groupBy(await this.getCharacterTitleModels(), title => title.characterId);
    const names = _.groupBy(await this.getCharacterNameModels(), name => name.characterId);

    const collection = _.merge(
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
      })));

    return reduceKeys(Object.keys(collection), key => {
      const defaultVariant = Object.keys(collection[key].variants).sort()[0];
      const name = collection[key].variants[defaultVariant].name;

      return {
        ...collection[key],
        name
      }
    });
  }

  private async getCharacterTitleModels(): Promise<Array<CharacterTitle>> {
    const file = await this._localeRepository.getCharacterTitles();
    return LocaleHelper.formatFile(file, (blocks) => {
      const ids = blocks[0].split(' ');
      return {
        characterId: ids[0],
        variantId: ids[1],
        title: blocks[1],
        description: blocks[2]
      }
    });
  }

  private async getCharacterNameModels(): Promise<Array<CharacterName>> {
    const file = await this._localeRepository.getCharacterNames();
    return LocaleHelper.formatFile(file, (blocks) => {
      const ids = blocks[0].split(' ');
      return {
        characterId: ids[0],
        variantId: ids[1],
        name: blocks[1]
      }
    });
  }
}