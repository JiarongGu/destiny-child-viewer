import * as FileAsync from 'lowdb/adapters/FileAsync';
import * as lowdb from 'lowdb';
import * as _ from 'lodash';

import { memorizeAsync } from '@decorators';
import { getCharacterId, reduceMap, readdir, getFilename } from '@utils';
import { PathService } from '@services';
import { MetadataService } from './metadata-service';

export class IconDataService {
  private _pathService: PathService;
  private _metadataService: MetadataService;

  constructor() {
    this._pathService = new PathService;
    this._metadataService = new MetadataService();
  }

  public async getPortraits() {
    const characters = await this._metadataService.getCharacterMetadata();
    const filePath = this._pathService.getDataPath('icon-portrait.json');
    const keys = Object.keys(characters).filter(id => !id.startsWith('s'));
    return await this.loadIconMap(filePath, this._pathService.getAssetPath('icon/portrait'), keys);
  }

  public async getPortraitsBattle() {
    const characters = await this._metadataService.getCharacterMetadata();
    const filePath = this._pathService.getDataPath('icon-portrait-battle.json');
    const keys = Object.keys(characters).filter(id => !id.startsWith('s'));
    return await this.loadIconMap(filePath, this._pathService.getAssetPath('icon/portrait_battle'), keys);
  }

  private async loadIconMap(json:string, iconDir: string, keys: Array<string>) {
    const iconMap = await lowdb(new FileAsync(json));
    const formattedIds = keys.map(getCharacterId);
    const folderGroups = _.groupBy(formattedIds, ids => ids.folder)
    
    Object.keys(folderGroups).map(async key => {
      const formattedIdsGroup = folderGroups[key];
      await Promise.all(formattedIdsGroup.map(async (ids, index) => {
        const map = iconMap.get(ids.map).value();

        if (!map) {
          const dir = `${iconDir}/${key}`;
          const files = await this.getIconFilesIndex(dir);
          const file = files[index];
          iconMap.set(ids.map, file).write();
        }
      }));
    });

    return iconMap.value();
  }

  @memorizeAsync
  private async getIconFilesIndex(dir: string): Promise<{ [key: number]: string }> {
    const files = await readdir(dir);
    return reduceMap(files, file => parseInt(getFilename(file), 10), file => file);
  }
}