
import * as _ from 'lodash';

import {
  LocaleType,
  LocaleHelper,
  CharacterVoiceType,
  CharacterStatic,
  CharacterFavorLevel,
  reduceMap,
  reduceKeys
} from '@shared';
import { PathService } from '@main/services';

import { LocaleRepository } from '../locale/locale-repository';
import { FileLocator } from '../common';

interface PCharacterTitle {
  characterId: string;
  variantId: string;
  title: string;
  description: string;
}

interface PCharacterName {
  characterId: string;
  variantId: string;
  name: string;
}

interface PCharacterVoice {
  characterId: string;
  variantId?: string;
  filePath: string;
  type: CharacterVoiceType;
  text: string;
}

interface PCharacterFavor {
  characterId: string;
  level: CharacterFavorLevel;
  description: string;
}

export class CharacterInitializer {
  private readonly _localeRepository = new LocaleRepository();
  private readonly _pathService = new PathService();
  private readonly _voiceDirectory = this._pathService.relativeResourcePath(FileLocator.VOICE_DIRECTORY);

  public async getStaticCollection(): Promise<{ [key: string]: CharacterStatic }> {
    const titles = _.groupBy(await this.getCharacterTitles(), title => title.characterId);
    const names = _.groupBy(await this.getCharacterNames(), name => name.characterId);
    const voices = _.groupBy(await this.getCharacterVoices(), voice => voice.characterId);
    const favors = _.groupBy(await this.getCharacterFavors(), favor => favor.characterId);

    const collection = _.merge(
      reduceKeys(Object.keys(titles), key => ({
        variants: reduceMap(titles[key], variant => variant.variantId, variant => ({
          title: variant.title,
          description: variant.description
        }))
      })),
      reduceKeys(Object.keys(names), key => ({
        variants: reduceMap(names[key], variant => variant.variantId, variant => ({
          name: variant.name
        }))
      })),
      reduceKeys(Object.keys(voices), key => {
        const variantGroups = _.groupBy(voices[key].filter(x => x.variantId), voice => voice.variantId);
        const characterVoices = voices[key].filter(x => !x.variantId);

        return {
          voices: reduceMap(characterVoices, voice => voice.type, voice => ({
            text: voice?.text,
            filePath: voice?.filePath,
          })),
          variants: reduceKeys(Object.keys(variantGroups), key => ({
            voices: reduceMap(variantGroups[key], voice => voice.type, voice => ({
              text: voice?.text,
              filePath: voice?.filePath,
            })),
          }))
        };
      }),
      reduceKeys(Object.keys(favors), key => ({
        favors: reduceMap(favors[key], favor => favor.level, favor => favor.description)
      }))
    );
    return collection;
  }

  public async getCharacterTitles(): Promise<Array<PCharacterTitle>> {
    const titleFile = await this._localeRepository.get(LocaleType.CharacterTitle);
    return LocaleHelper.formatFile(titleFile, (blocks) => {
      const ids = blocks[0].split('_');
      return {
        characterId: ids[0],
        variantId: ids[1],
        title: LocaleHelper.formatText(blocks[1]),
        description: LocaleHelper.formatText(blocks[2])
      }
    });
  }

  public async getCharacterNames(): Promise<Array<PCharacterName>> {
    const nameFile = await this._localeRepository.get(LocaleType.CharacterName);
    return LocaleHelper.formatFile(nameFile, (blocks) => {
      const ids = blocks[0].split('_');
      return {
        characterId: ids[0],
        variantId: ids[1],
        name: LocaleHelper.formatText(blocks[1])
      }
    });
  }

  public async getCharacterVoices(): Promise<Array<PCharacterVoice>> {
    const voiceFile = await this._localeRepository.get(LocaleType.CharacterVoice);
    const voiceTypeDictionary = this.getVoiceTypeDictionary();

    const voices = await Promise.all(LocaleHelper.formatFile(voiceFile, async (blocks) => {
      const fileName = blocks[0];
      const text = LocaleHelper.formatText(blocks[1]);
      const filePath = `${this._voiceDirectory}\\${fileName}.ogg`;
      const type = this.matchVoiceType(voiceTypeDictionary, fileName.split('_').splice(1));

      if (!type || !text) {
        console.warn(blocks);
        return;
      }

      const ids = fileName.substring(0, fileName.indexOf(type)).split('_');
      const characterId = ids[0];
      const variantId = ids[1];

      return {
        characterId,
        variantId,
        filePath,
        type,
        text
      }
    }));

    return voices.filter(voice => voice) as Array<PCharacterVoice>;
  }

  public async getCharacterFavors(): Promise<Array<PCharacterFavor>> {
    const favorFile = await this._localeRepository.get(LocaleType.CharacterFavor);
    return LocaleHelper.formatFile(favorFile, (blocks) => {
      const ids = blocks[0].split('_');
      return {
        characterId: ids[0],
        level: ids[1] as CharacterFavorLevel,
        description: LocaleHelper.formatText(blocks[1]) || ''
      }
    });
  }

  private matchVoiceType(dictionary, blocks: Array<string>): CharacterVoiceType | undefined {
    const path = blocks.join('.');
    let type = _.get(dictionary, path);
    if (!type && blocks.length > 1) {
      type = this.matchVoiceType(dictionary, blocks.slice(1));
    }
    return type;
  }

  private getVoiceTypeDictionary() {
    const maps = {};
    Object.values(CharacterVoiceType).forEach(type => {
      _.set(maps, type.replace(/\_/g, '.'), type);
    });
    return maps;
  }
}