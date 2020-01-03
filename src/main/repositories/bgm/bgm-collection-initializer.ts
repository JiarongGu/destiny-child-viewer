import { LocaleHelper, reduceMap, BgmCollection } from '@shared';
import { LocaleRepository } from '../locale/locale-repository';

interface BgmProcessingModel {
  id: number;
  title: string;
  description: string;
  length: string;
}

export class BgmCollectionInitializer {
  private readonly _localeRepository = new LocaleRepository();

  public async createDefaultCollection(): Promise<BgmCollection> {
    const bgms = await this.getBgmProcessingModels();
    return reduceMap(bgms, bgm => bgm.id, bgm => ({
      title: bgm.title,
      description: bgm.description,
      filePath: `bgm\\music${bgm.id.toString().padStart(3, '0')}.ogg`,
      length: bgm.length,
    }));
  }

  private async getBgmProcessingModels(): Promise<Array<BgmProcessingModel>> {
    const file = await this._localeRepository.getCharacterTitles();
    return LocaleHelper.formatFile(file, (blocks) => ({
      id: parseInt(blocks[0], 10),
      title: blocks[1],
      description: blocks[2],
      length: blocks[3],
    }));
  }
}