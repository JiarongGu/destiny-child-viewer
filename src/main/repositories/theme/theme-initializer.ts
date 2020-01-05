
import { LocaleHelper, reduceMap, ThemeCollection, LocaleType } from '@shared';
import { PathService } from '@main/services';

import { LocaleRepository } from '../locale/locale-repository';
import { FileLocator } from './../common/file-locator';


interface BackgroundMusic {
  id: number;
  title: string;
  description: string;
  length: string;
}

export class ThemeInitializer {
  private readonly _localeRepository = new LocaleRepository();
  private readonly _pathService = new PathService();
  private readonly _bgmDirectory = this._pathService.relativeResourcePath(FileLocator.BGM_DIRECTORY);

  public async getCollection(): Promise<ThemeCollection> {
    const musics = reduceMap(await this.getBackgroundMusics(), model => model.id, model => ({
      title: model.title,
      description: model.description,
      filePath: `${this._bgmDirectory}\\music${model.id.toString().padStart(3, '0')}.ogg`,
      length: model.length,
    }));

    return {
      musics,
      images: {}
    }
  }

  private async getBackgroundMusics(): Promise<Array<BackgroundMusic>> {
    const file = await this._localeRepository.get(LocaleType.BackgroundMusic);
    return LocaleHelper.formatFile(file, (blocks) => ({
      id: parseInt(blocks[0], 10),
      title: LocaleHelper.formatText(blocks[1]),
      description: LocaleHelper.formatText(blocks[2]),
      length: blocks[3],
    }));
  }
}