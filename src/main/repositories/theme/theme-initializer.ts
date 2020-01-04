import { LocaleHelper, reduceMap, ThemeCollection, LocaleType } from '@shared';
import { LocaleRepository } from '../locale/locale-repository';

interface BackgroundMusic {
  id: number;
  title: string;
  description: string;
  length: string;
}

export class ThemeInitializer {
  private readonly _localeRepository = new LocaleRepository();

  public async getCollection(): Promise<ThemeCollection> {
    const musics = reduceMap(await this.getBackgroundMusics(), model => model.id, model => ({
      title: model.title,
      description: model.description,
      filePath: `asset\\bgm\\music${model.id.toString().padStart(3, '0')}.ogg`,
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
      title: blocks[1],
      description: blocks[2],
      length: blocks[3],
    }));
  }
}