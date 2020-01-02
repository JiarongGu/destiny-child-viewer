import * as _ from 'lodash';

import { reduceMap, reduceKeys } from '@utils';
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
  private readonly _localeRepository: LocaleRepository

  constructor() {
    this._localeRepository = new LocaleRepository();
  }

  public async createDefaultCollection() {
    const titles = await this.getCharacterTitleModels();
    const names = await this.getCharacterNameModels();

    const characterTitles = _.groupBy(titles, title => title.characterId);
    const characterNames = _.groupBy(names, name => name.characterId);

    return _.merge(
      reduceKeys(Object.keys(characterTitles), (key) => ({
        variants:
          reduceMap(characterTitles[key], variant => variant.variantId, variant => ({
            title: this.formatText(variant.title),
            description: this.formatText(variant.description)
          }))
      })),
      reduceKeys(Object.keys(characterNames), (key) => ({
        variants:
          reduceMap(characterNames[key], variant => variant.variantId, variant => ({
            name: this.formatText(variant.name)
          }))
      }))
    );
  }

  private async getCharacterTitleModels(): Promise<Array<CharacterTitle>> {
    const file = await this._localeRepository.getCharacterTitlesFile();
    return this.getDataLines(file).map(this.lineFormatter((identifiers, blocks) => ({
      characterId: identifiers.characterId,
      variantId: identifiers.variantId,
      title: blocks[0],
      description: blocks[1]
    })));
  }

  private async getCharacterNameModels(): Promise<Array<CharacterName>> {
    const file = await this._localeRepository.getCharacterNamesFile();
    return this.getDataLines(file).map(this.lineFormatter((identifiers, blocks) => ({
      characterId: identifiers.characterId,
      variantId: identifiers.variantId,
      name: blocks[0]
    })));
  }

  private formatText(text) {
    return text && text.replace(/\r/g, '').replace(/\_/g, ' ').trim();
  }

  private getDataLines(file: string): Array<string> {
    return file.split('\n').filter(line => line && line.indexOf('\/\/') < 0);
  }

  private lineFormatter = <T>(
    formatter: (identifier: CharacterIdentifiers, block: Array<string>) => T
  ) => (line: string) => {
    const blocks = line.split('\t');
    const identifiers = CharacterHelper.getCharacterIdentifiers(blocks[0]);
    return formatter(identifiers, blocks.slice(1))
  }
}